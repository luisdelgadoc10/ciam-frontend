// src/hooks/useActividades.js
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
  downloadAttendancePDF,
  downloadInscritosExcel,
} from "../api/services/actividadesService";

import { useConfirmDialog } from "../context/ConfirmProvider";
import useToast from "./useToast";

export default function useActividades() {
  const { ask } = useConfirmDialog();
  const toast = useToast();

  const [actividades, setActividades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [adultos, setAdultos] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🆕 Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(15);

  const [selectedActividad, setSelectedActividad] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInscritosModal, setShowInscritosModal] = useState(false);
  const [showInscribirModal, setShowInscribirModal] = useState(false);

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
  }, [currentPage, perPage]);

  const fetchAll = async () => {
    await Promise.all([fetchActividades(), fetchTipos(), fetchAdultos()]);
  };

  const fetchActividades = async () => {
    setLoading(true);
    try {
      const { data } = await getActividades(currentPage, perPage);
      const list = data.data || [];
      setActividades(Array.isArray(list) ? list : []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
      setCurrentPage(data.current_page || 1);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
      toast.error("No se pudieron cargar las actividades.");
      setActividades([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async () => {
    try {
      const { data } = await getTiposActividades();
      setTipos(data);
    } catch {
      toast.error("Error al cargar los tipos de actividad.");
    }
  };

  const fetchAdultos = async () => {
    try {
      const { data } = await getAdultosMayores();
      setAdultos(data.data || data);
    } catch {
      toast.error("Error al cargar adultos mayores.");
    }
  };

  const fetchInscritos = async (actividadId) => {
    try {
      const { data } = await getInscritos(actividadId);
      setInscritos(data.data || data);
    } catch {
      toast.error("Error al cargar inscritos.");
    }
  };

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing && selectedActividad) {
        await updateActividad(selectedActividad.id, formData);
        toast.success("Actividad actualizada correctamente.");
      } else {
        await createActividad(formData);
        toast.success("Actividad creada correctamente.");
      }

      await fetchActividades();
      setShowModal(false);
      resetForm();
      setIsEditing(false);
      setSelectedActividad(null);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.warning("Revise los campos del formulario.");
      } else {
        console.error("Error al guardar actividad:", error);
        toast.error("Error al guardar actividad.");
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

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setSelectedActividad(null);
    setShowModal(true);
  };

  // 🆕 Aquí usamos variant 'error' para eliminar
  const handleDelete = async (id) => {
    const confirmed = await ask({
      title: "Eliminar actividad",
      message:
        "¿Deseas eliminar esta actividad? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "error",
    });

    if (!confirmed) return;

    try {
      await deleteActividad(id);
      await fetchActividades();
      toast.success("Actividad eliminada.");
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      toast.error("No se pudo eliminar.");
    }
  };

  // 🆕 Aquí usamos variant 'success' para inscribir
  const handleInscribirAdulto = async (adultoId) => {
    if (!selectedActividad) return;

    const confirmed = await ask({
      title: "Inscribir adulto",
      message: "¿Deseas inscribir este adulto a la actividad?",
      confirmText: "Inscribir",
      cancelText: "Cancelar",
      variant: "success",
    });

    if (!confirmed) return;

    try {
      await inscribirAdulto(selectedActividad.id, adultoId);
      await fetchInscritos(selectedActividad.id);
      await fetchActividades();
      toast.success("Adulto inscrito correctamente.");
    } catch (error) {
      console.error("Error al inscribir adulto:", error);
      toast.error("No se pudo inscribir.");
    }
  };

  // 🆕 Aquí usamos variant 'warning' para desinscribir
  const handleDesinscribir = async (adultoId) => {
    if (!selectedActividad) return;

    const confirmed = await ask({
      title: "Quitar inscripción",
      message: "¿Deseas desinscribir este adulto de la actividad?",
      confirmText: "Desinscribir",
      cancelText: "Cancelar",
      variant: "warning",
    });

    if (!confirmed) return;

    try {
      await desinscribirAdulto(selectedActividad.id, adultoId);
      await fetchInscritos(selectedActividad.id);
      await fetchActividades();
      toast.success("Adulto desinscrito.");
    } catch (error) {
      console.error("Error al desinscribir adulto:", error);
      toast.error("No se pudo desinscribir.");
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

  const handleDownloadAttendance = async (actividad) => {
    if (!actividad) return;
    try {
      const response = await downloadAttendancePDF(actividad.id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Lista_Asistencia_${actividad.nombre}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF descargado.");
    } catch (error) {
      console.error("Error al descargar lista de asistencia:", error);
      toast.error("Error al descargar PDF.");
    }
  };

  const handleDownloadExcel = async (actividadId) => {
    if (!actividadId) return;
    try {
      const blob = await downloadInscritosExcel(actividadId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `actividad-${actividadId}-inscritos.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Excel descargado.");
    } catch (error) {
      console.error("Error al descargar Excel:", error);
      toast.error("Error al descargar Excel.");
    }
  };

  // Funciones de paginación
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  return {
    actividades,
    tipos,
    adultos,
    inscritos,
    adultosDisponibles,
    loading,

    currentPage,
    lastPage,
    total,
    perPage,

    selectedActividad,
    isEditing,
    showModal,
    showViewModal,
    showInscritosModal,
    showInscribirModal,

    formData,
    errors,

    fetchActividades,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleVerInscritos,
    handleInscribir,
    handleInscribirAdulto,
    handleDesinscribir,
    handleFormChange,
    handleSubmit,
    setShowModal,
    setShowViewModal,
    setShowInscritosModal,
    setShowInscribirModal,
    handleDownloadAttendance,
    handleDownloadExcel,

    handlePageChange,
    handlePerPageChange,
  };
}
