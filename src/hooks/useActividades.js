import { useState, useEffect, useMemo } from "react";
import {
  getActividades,
  getTiposActividades,
  getAdultosMayores,
  getInscritos,
  createActividad,
  updateActividad,
  deleteActividad,
  inscribirAdulto,
  desinscribirAdulto,
} from "../api/services/actividadesService";

export default function useActividades() {
  const [actividades, setActividades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [adultos, setAdultos] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedActividad, setSelectedActividad] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInscritosModal, setShowInscritosModal] = useState(false);
  const [showInscribirModal, setShowInscribirModal] = useState(false);

  // 👇 NUEVO: Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    tipo_actividad_id: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    capacidad: "",
    ubicacion: "",
  });
  const [errors, setErrors] = useState({});

  const adultosDisponibles = useMemo(() => {
    return adultos.filter(
      (adulto) => !inscritos.some((inscrito) => inscrito.id === adulto.id)
    );
  }, [adultos, inscritos]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchActividades(), fetchTipos(), fetchAdultos()]);
  };

  const fetchActividades = async () => {
    setLoading(true);
    try {
      const { data } = await getActividades();
      setActividades(data.data || data);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async () => {
    const { data } = await getTiposActividades();
    setTipos(data);
  };

  const fetchAdultos = async () => {
    const { data } = await getAdultosMayores();
    setAdultos(data.data || data);
  };

  const fetchInscritos = async (actividadId) => {
    const { data } = await getInscritos(actividadId);
    setInscritos(data.data || data);
  };

  // 👇 NUEVO: Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo_actividad_id: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      capacidad: "",
      ubicacion: "",
    });
    setErrors({});
  };

  // 👇 NUEVO: Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 👇 NUEVO: Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing && selectedActividad) {
        await updateActividad(selectedActividad.id, formData);
      } else {
        await createActividad(formData);
      }
      await fetchActividades();
      setShowModal(false);
      resetForm();
      setIsEditing(false);
      setSelectedActividad(null);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error al guardar actividad:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (actividad) => {
    setSelectedActividad(actividad);
    setShowViewModal(true);
  };

  const handleEdit = (actividad) => {
    setSelectedActividad(actividad);
    // 👇 Cargar datos en el formulario
    setFormData({
      nombre: actividad.nombre || "",
      tipo_actividad_id: actividad.tipo_actividad?.id?.toString() || "",
      descripcion: actividad.descripcion || "",
      fecha_inicio: actividad.fecha_inicio
        ? new Date(actividad.fecha_inicio).toISOString().slice(0, 16)
        : "",
      fecha_fin: actividad.fecha_fin
        ? new Date(actividad.fecha_fin).toISOString().slice(0, 16)
        : "",
      capacidad: actividad.capacidad || "",
      ubicacion: actividad.ubicacion || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // 👇 NUEVO: Abrir modal de crear
  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setSelectedActividad(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta actividad?")) return;
    try {
      await deleteActividad(id);
      fetchActividades();
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    }
  };

  const handleVerInscritos = async (actividad) => {
    setSelectedActividad(actividad);
    await fetchInscritos(actividad.id);
    setShowInscritosModal(true);
    setShowInscribirModal(false);
  };

  const handleInscribir = async (actividad) => {
    setSelectedActividad(actividad);
    await fetchInscritos(actividad.id);
    setShowInscribirModal(true);
    setShowInscritosModal(false);
  };

  const handleInscribirAdulto = async (adultoId) => {
    if (!selectedActividad) return;
    try {
      await inscribirAdulto(selectedActividad.id, adultoId);
      await fetchInscritos(selectedActividad.id);
      await fetchActividades();
    } catch (error) {
      console.error("Error al inscribir adulto:", error);
    }
  };

  const handleDesinscribir = async (adultoId) => {
    if (!selectedActividad) return;
    try {
      await desinscribirAdulto(selectedActividad.id, adultoId);
      await fetchInscritos(selectedActividad.id);
      await fetchActividades();
    } catch (error) {
      console.error("Error al desinscribir adulto:", error);
    }
  };

  return {
    actividades,
    tipos,
    adultos,
    inscritos,
    adultosDisponibles,
    loading,
    selectedActividad,
    isEditing,
    showModal,
    showViewModal,
    showInscritosModal,
    showInscribirModal,
    formData, // 👈 NUEVO
    errors, // 👈 NUEVO
    fetchActividades,
    handleView,
    handleEdit,
    handleCreate, // 👈 NUEVO
    handleDelete,
    handleVerInscritos,
    handleInscribir,
    handleInscribirAdulto,
    handleDesinscribir,
    handleFormChange, // 👈 NUEVO
    handleSubmit, // 👈 NUEVO
    setShowModal,
    setShowViewModal,
    setShowInscritosModal,
    setShowInscribirModal,
  };
}
