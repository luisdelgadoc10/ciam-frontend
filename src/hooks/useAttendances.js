import { useState, useEffect } from "react";
import {
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendancesByActivity,
  getAttendancesByAdultoMayor,
} from "../api/services/attendancesService";

import {
  getActividades,
  getInscritos,
} from "../api/services/actividadesService";
import { getAdultosMayores } from "../api/services/adultoMayorService";

export default function useAttendances() {
  const [attendances, setAttendances] = useState([]);
  const [activities, setActivities] = useState([]);
  const [adultosMayores, setAdultosMayores] = useState([]);
  const [inscritosActividad, setInscritosActividad] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [formData, setFormData] = useState({
    activity_id: "",
    adulto_mayor_id: "",
    attendance_date: "",
    status: "asistió", // ✅ Cambiado de 'estado' a 'status'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState(null); // null = sin filtro
  const [selectedFilter, setSelectedFilter] = useState("");

  // 🔹 Cargar actividades y adultos mayores al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        const [actsRes, adultsRes] = await Promise.all([
          getActividades(),
          getAdultosMayores(),
        ]);

        setActivities(actsRes.data?.data || actsRes.data || []);
        setAdultosMayores(adultsRes.data?.data || adultsRes.data || []);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };
    loadData();
  }, []);

  // 🔹 Cargar inscritos cuando se selecciona una actividad en el formulario
  useEffect(() => {
    if (formData.activity_id) {
      fetchInscritosByActivity(formData.activity_id);
    } else {
      setInscritosActividad([]);
      setFormData((prev) => ({ ...prev, adulto_mayor_id: "" }));
    }
  }, [formData.activity_id]);

  // 🔹 Obtener inscritos de una actividad
  const fetchInscritosByActivity = async (activityId) => {
    try {
      const res = await getInscritos(activityId);
      setInscritosActividad(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Error al cargar inscritos:", error);
      setInscritosActividad([]);
    }
  };

  // 🔹 Crear o actualizar asistencia
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing && selectedAttendance) {
        await updateAttendance(selectedAttendance.id, formData);
      } else {
        await createAttendance(formData);
      }

      setShowModal(false);
      resetForm();

      // Recargar asistencias según el filtro activo
      if (filterType === "activity" && selectedFilter) {
        await fetchAttendancesByActivity(selectedFilter);
      } else if (filterType === "adulto" && selectedFilter) {
        await fetchAttendancesByAdultoMayor(selectedFilter);
      }
      // Si no hay filtro, no recargamos nada (mantiene el estado vacío)
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Error al guardar asistencia:", error);
        alert("Error al guardar la asistencia. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resetear formulario
  const resetForm = () => {
    setFormData({
      activity_id: "",
      adulto_mayor_id: "",
      attendance_date: "",
      status: "asistió", // ✅ Cambiado
    });
    setErrors({});
    setIsEditing(false);
    setSelectedAttendance(null);
    setInscritosActividad([]);
  };

  // 🔹 Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 🔹 Crear nueva asistencia
  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // 🔹 Editar asistencia
  const handleEdit = (attendance) => {
    setIsEditing(true);
    setSelectedAttendance(attendance);
    setFormData({
      activity_id: attendance.activity_id || "",
      adulto_mayor_id: attendance.adulto_mayor_id || "",
      attendance_date: attendance.attendance_date || "",
      status: attendance.status || "asistió", // ✅ Cambiado
    });
    setShowModal(true);
  };

  // 🔹 Ver detalles
  const handleView = (attendance) => {
    setSelectedAttendance(attendance);
    setShowViewModal(true);
  };

  // 🔹 Eliminar asistencia
  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta asistencia?")) return;

    try {
      await deleteAttendance(id);
      setAttendances((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error al eliminar asistencia:", error);
      alert("Error al eliminar la asistencia.");
    }
  };

  // 🔹 Cargar asistencias por actividad
  const fetchAttendancesByActivity = async (activityId) => {
    if (!activityId) {
      handleClearFilter();
      return;
    }

    setLoading(true);
    try {
      const res = await getAttendancesByActivity(activityId);
      console.log("✅ Respuesta completa:", res);
      console.log("✅ Datos:", res.data);

      // Intentar diferentes estructuras de respuesta
      const data = res.data?.data || res.data?.attendances || res.data || [];
      console.log("✅ Asistencias procesadas:", data);

      // 🔹 Normalizar datos para incluir la actividad actual si el backend la omite
      const normalized = data.map((item) => ({
        ...item,
        activity:
          item.activity ||
          activities.find((a) => a.id === Number(activityId)) ||
          null,
      }));

      setAttendances(Array.isArray(normalized) ? normalized : []);
      setFilterType("activity");
      setSelectedFilter(activityId);
    } catch (error) {
      console.error("❌ Error al cargar asistencias por actividad:", error);
      console.error("📊 Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });

      // Mensajes específicos según el error
      let errorMessage = "Error al cargar asistencias.";

      if (error.response?.status === 500) {
        console.error("🔴 Error 500 - Problema en el servidor");
        console.error("Posibles causas:");
        console.error("1. Error en la base de datos (relaciones, consultas)");
        console.error("2. Error en el controlador del backend");
        console.error("3. La actividad existe pero tiene datos corruptos");

        errorMessage =
          "Error del servidor. La actividad puede no tener datos válidos o hay un problema en el backend.";
      } else if (error.response?.status === 404) {
        errorMessage = "No se encontró el endpoint o la actividad no existe.";
      } else if (error.response?.status === 401) {
        errorMessage =
          "No estás autorizado. Por favor, inicia sesión nuevamente.";
      }

      alert(errorMessage + "\n\nRevisa la consola para más detalles.");

      setAttendances([]);
      setFilterType(null);
      setSelectedFilter("");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar asistencias por adulto mayor
  const fetchAttendancesByAdultoMayor = async (adultoId) => {
    if (!adultoId) {
      handleClearFilter();
      return;
    }

    setLoading(true);
    try {
      const res = await getAttendancesByAdultoMayor(adultoId);
      console.log("Respuesta adulto mayor:", res);

      // Intentar diferentes estructuras de respuesta
      const data = res.data?.data || res.data?.attendances || res.data || [];
      console.log("Asistencias adulto mayor procesadas:", data);

      setAttendances(Array.isArray(data) ? data : []);
      setFilterType("adulto");
      setSelectedFilter(adultoId);
    } catch (error) {
      console.error("Error al cargar asistencias por adulto mayor:", error);
      console.error("Detalles del error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Mostrar mensaje más específico al usuario
      if (error.response?.status === 500) {
        alert(
          "Error del servidor al cargar asistencias. Por favor, contacta al administrador."
        );
      }

      setAttendances([]);
      setFilterType(null);
      setSelectedFilter("");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Limpiar filtro
  const handleClearFilter = () => {
    setFilterType(null);
    setSelectedFilter("");
    setAttendances([]);
  };

  return {
    attendances,
    activities,
    adultosMayores,
    inscritosActividad,
    selectedAttendance,
    formData,
    setFormData,
    errors,
    loading,
    showModal,
    showViewModal,
    isEditing,
    filterType,
    selectedFilter,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleFormChange,
    handleSubmit,
    handleClearFilter,
    fetchAttendancesByActivity,
    fetchAttendancesByAdultoMayor,
    setShowModal,
    setShowViewModal,
  };
}
