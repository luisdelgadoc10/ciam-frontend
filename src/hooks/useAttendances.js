// src/hooks/useAttendances.js
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

// NUEVO: Confirmación y Toasts
import { useConfirmDialog } from "../context/ConfirmProvider";
import { useToastContext } from "../context/ToastProvider";

export default function useAttendances() {
  const { ask } = useConfirmDialog();
  const { success, error: toastError, warning } = useToastContext();

  const [attendances, setAttendances] = useState([]);
  const [activities, setActivities] = useState([]);
  const [adultosMayores, setAdultosMayores] = useState([]);
  const [inscritosActividad, setInscritosActividad] = useState([]);

  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    activity_id: "",
    adulto_mayor_id: "",
    attendance_date: "",
    status: "asistió",
  });

  // -------------------------------------------
  // CARGAR ACTIVIDADES Y ADULTOS
  // -------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [actsRes, adultsRes] = await Promise.all([
          getActividades(),
          getAdultosMayores(),
        ]);

        setActivities(actsRes.data?.data || actsRes.data || []);
        setAdultosMayores(adultsRes.data?.data || adultsRes.data || []);
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
        toastError("Error al cargar actividades o adultos mayores.");
      }
    };

    loadData();
  }, []);

  // -------------------------------------------
  // CAMBIO DE ACTIVIDAD → CARGAR INSCRITOS
  // -------------------------------------------
  useEffect(() => {
    if (formData.activity_id) {
      fetchInscritosByActivity(formData.activity_id);
    } else {
      setInscritosActividad([]);
      setFormData((prev) => ({ ...prev, adulto_mayor_id: "" }));
    }
  }, [formData.activity_id]);

  // -------------------------------------------
  // FUNCIONES
  // -------------------------------------------

  const fetchInscritosByActivity = async (activityId) => {
    try {
      const res = await getInscritos(activityId);
      setInscritosActividad(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error al cargar inscritos:", err);
      toastError("No se pudo cargar los inscritos.");
      setInscritosActividad([]);
    }
  };

  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (attendance) => {
    setIsEditing(true);
    setSelectedAttendance(attendance);

    setFormData({
      activity_id: attendance.activity_id || "",
      adulto_mayor_id: attendance.adulto_mayor_id || "",
      attendance_date: attendance.attendance_date || "",
      status: attendance.status || "asistió",
    });

    setShowModal(true);
  };

  const handleView = (attendance) => {
    setSelectedAttendance(attendance);
    setShowViewModal(true);
  };

  // -------------------------------------------
  // ELIMINAR ASISTENCIA (con confirmación UI)
  // -------------------------------------------
  const handleDelete = async (id) => {
    const confirmed = await ask({
      title: "Eliminar asistencia",
      message: "¿Deseas eliminar esta asistencia? Esta acción es irreversible.",
    });

    if (!confirmed) return;

    try {
      await deleteAttendance(id);
      setAttendances((prev) => prev.filter((a) => a.id !== id));
      success("Asistencia eliminada.");
    } catch (err) {
      console.error("Error al eliminar asistencia:", err);
      toastError("No se pudo eliminar la asistencia.");
    }
  };

  // -------------------------------------------
  // SUBMIT (Crear / Editar)
  // -------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing && selectedAttendance) {
        await updateAttendance(selectedAttendance.id, formData);
        success("Asistencia actualizada correctamente.");
      } else {
        await createAttendance(formData);
        success("Asistencia registrada correctamente.");
      }

      setShowModal(false);
      resetForm();

      // refrescar según el filtro activo
      if (filterType === "activity" && selectedFilter) {
        await fetchAttendancesByActivity(selectedFilter);
      } else if (filterType === "adulto" && selectedFilter) {
        await fetchAttendancesByAdultoMayor(selectedFilter);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        toastError("Hay errores en el formulario.");
      } else {
        console.error("Error al guardar asistencia:", err);
        toastError("Error al guardar la asistencia.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // FILTROS
  // -------------------------------------------
  const fetchAttendancesByActivity = async (activityId) => {
    if (!activityId) return handleClearFilter();

    setLoading(true);

    try {
      const res = await getAttendancesByActivity(activityId);
      const data = res.data?.data || res.data?.attendances || res.data || [];

      const normalized = data.map((item) => ({
        ...item,
        activity:
          item.activity ||
          activities.find((a) => a.id === Number(activityId)) ||
          null,
      }));

      setAttendances(normalized);
      setFilterType("activity");
      setSelectedFilter(activityId);

      success("Asistencias cargadas.");
    } catch (err) {
      console.error("Error al cargar asistencias:", err);
      toastError("No se pudo cargar las asistencias.");
      handleClearFilter();
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendancesByAdultoMayor = async (adultoId) => {
    if (!adultoId) return handleClearFilter();

    setLoading(true);

    try {
      const res = await getAttendancesByAdultoMayor(adultoId);
      const data = res.data?.data || res.data?.attendances || res.data || [];

      setAttendances(data);
      setFilterType("adulto");
      setSelectedFilter(adultoId);

      success("Asistencias del adulto mayor cargadas.");
    } catch (err) {
      console.error("Error al cargar asistencias:", err);
      toastError("No se pudo cargar asistencias del adulto mayor.");
      handleClearFilter();
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilterType(null);
    setSelectedFilter("");
    setAttendances([]);
  };

  // -------------------------------------------
  // UTILS
  // -------------------------------------------
  const resetForm = () => {
    setFormData({
      activity_id: "",
      adulto_mayor_id: "",
      attendance_date: "",
      status: "asistió",
    });
    setSelectedAttendance(null);
    setInscritosActividad([]);
    setErrors({});
    setIsEditing(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // -------------------------------------------
  // RETORNO
  // -------------------------------------------
  return {
    attendances,
    activities,
    adultosMayores,
    inscritosActividad,

    selectedAttendance,
    formData,
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

    fetchAttendancesByActivity,
    fetchAttendancesByAdultoMayor,
    handleClearFilter,

    setShowModal,
    setShowViewModal,
  };
}
