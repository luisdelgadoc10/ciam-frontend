// src/hooks/useAdultosMayores.js
import { useState, useEffect } from "react";
import {
  getAdultosMayores,
  createAdultoMayor,
  updateAdultoMayor,
  deleteAdultoMayor,
  getSexos,
  getEstadosCiviles,
  getParentescos,
  getCumpleanos, // 🆕 Importar función de cumpleaños
  getCarnetAdultoMayor,
} from "../api/services/adultoMayorService";

import { useConfirmDialog } from "../context/ConfirmProvider";
import useToast from "../hooks/useToast";

export default function useAdultosMayores() {
  const { ask } = useConfirmDialog();
  const toast = useToast();

  const [adultosMayores, setAdultosMayores] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [selectedAdulto, setSelectedAdulto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);

  const [showCarnetModal, setShowCarnetModal] = useState(false);
  const [carnetData, setCarnetData] = useState(null);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    fecha_nacimiento: "",
    direccion: "",
    celular: "",
    sexo_id: "",
    estado_civil_id: "",
    contacto_emergencia_nombres: "",
    contacto_emergencia_apellidos: "",
    contacto_emergencia_telefono: "",
    parentesco_id: "",
    foto: null,
    foto_url: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
  }, [currentPage, perPage]);

  const fetchAll = async () => {
    await Promise.all([
      fetchAdultosMayores(),
      fetchSexos(),
      fetchEstadosCiviles(),
      fetchParentescos(),
    ]);
  };

  const fetchAdultosMayores = async () => {
    try {
      setLoading(true);
      const { data } = await getAdultosMayores(currentPage, perPage);

      const list = data.data || [];
      setAdultosMayores(Array.isArray(list) ? list : []);

      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
      setCurrentPage(data.current_page || 1);
    } catch (error) {
      console.error("Error al cargar adultos mayores:", error);
      toast.error("Error al cargar adultos mayores");
      setAdultosMayores([]);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Función para obtener TODOS los cumpleaños (sin paginación)
  const fetchTodosCumpleanos = async (mes = null) => {
    try {
      setLoading(true);
      const { data } = await getCumpleanos(mes);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al cargar cumpleaños:", error);
      toast.error("Error al cargar cumpleaños");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSexos = async () => {
    try {
      const { data } = await getSexos();
      setSexos(data);
    } catch (error) {
      console.error("Error al cargar sexos:", error);
      toast.error("Error al cargar sexos");
    }
  };

  const fetchEstadosCiviles = async () => {
    try {
      const { data } = await getEstadosCiviles();
      setEstadosCiviles(data);
    } catch (error) {
      console.error("Error al cargar estados civiles:", error);
      toast.error("Error al cargar estados civiles");
    }
  };

  const fetchParentescos = async () => {
    try {
      const { data } = await getParentescos();
      setParentescos(data);
    } catch (error) {
      console.error("Error al cargar parentescos:", error);
      toast.error("Error al cargar parentescos");
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedAdulto(null);
    setFormData({
      nombres: "",
      apellidos: "",
      dni: "",
      fecha_nacimiento: "",
      direccion: "",
      celular: "",
      sexo_id: "",
      estado_civil_id: "",
      contacto_emergencia_nombres: "",
      contacto_emergencia_apellidos: "",
      contacto_emergencia_telefono: "",
      parentesco_id: "",
      foto: null,
      foto_url: null,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (adulto) => {
    setIsEditing(true);
    setSelectedAdulto(adulto);

    let fotoUrl =
      adulto.foto_url ||
      adulto.foto ||
      adulto.imagen ||
      adulto.imagen_url ||
      null;

    if (fotoUrl && !fotoUrl.startsWith("http")) {
      fotoUrl = `https://ciam.api.munimoche.gob.pe${fotoUrl}`;
    }

    setFormData({
      nombres: adulto.nombres || "",
      apellidos: adulto.apellidos || "",
      dni: adulto.dni || "",
      fecha_nacimiento: adulto.fecha_nacimiento || "",
      direccion: adulto.direccion || "",
      celular: adulto.celular || "",
      sexo_id: adulto.sexo?.id || "",
      estado_civil_id: adulto.estado_civil?.id || "",
      contacto_emergencia_nombres: adulto.contacto_emergencia?.nombres || "",
      contacto_emergencia_apellidos:
        adulto.contacto_emergencia?.apellidos || "",
      contacto_emergencia_telefono: adulto.contacto_emergencia?.telefono || "",
      parentesco_id: adulto.contacto_emergencia?.parentesco?.id || "",
      foto: null,
      foto_url: fotoUrl,
    });
    setShowModal(true);
  };

  const handleView = (adulto) => {
    let fotoUrl =
      adulto.foto_url ||
      adulto.foto ||
      adulto.imagen ||
      adulto.imagen_url ||
      null;

    if (fotoUrl && !fotoUrl.startsWith("http")) {
      fotoUrl = `https://ciam.api.munimoche.gob.pe/${fotoUrl}`;
    }

    setSelectedAdulto({ ...adulto, foto_url: fotoUrl });
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await ask({
      title: "Eliminar adulto mayor",
      message: "¿Está seguro de eliminar este registro?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "error",
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteAdultoMayor(id);
      await fetchAdultosMayores();
      toast.success("Adulto mayor eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      setFormData((prev) => ({
        ...prev,
        foto: files[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "foto_url") return;
        if (isEditing && key === "dni" && selectedAdulto?.dni === value) {
          return;
        }

        if (key === "foto") {
          if (value instanceof File) fd.append("foto", value);
        } else if (value !== "" && value !== null) {
          fd.append(key, value);
        }
      });

      if (isEditing) {
        fd.append("_method", "PUT");
        await updateAdultoMayor(selectedAdulto.id, fd);
        toast.success("Registro actualizado correctamente");
      } else {
        await createAdultoMayor(fd);
        toast.success("Adulto mayor registrado correctamente");
      }

      setShowModal(false);
      await fetchAdultosMayores();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.warning("Hay errores en el formulario");
      } else {
        toast.error("Ocurrió un error al guardar");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // 🪪 Obtener datos del carnet virtual (QR)
  const fetchCarnet = async (id) => {
    try {
      setLoading(true);
      const { data } = await getCarnetAdultoMayor(id);

      setCarnetData(data); // ✔️ Guardar datos
      setShowCarnetModal(true); // ✔️ Abrir modal
    } catch (error) {
      console.error("Error al obtener carnet:", error);
      toast.error("No se pudo obtener el carnet del adulto mayor");
    } finally {
      setLoading(false);
    }
  };

  return {
    adultosMayores,
    sexos,
    estadosCiviles,
    parentescos,
    selectedAdulto,
    formData,
    errors,
    loading,
    showModal,
    showViewModal,
    isEditing,
    currentPage,
    lastPage,
    total,
    perPage,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleFormChange,
    handleSubmit,
    setShowModal,
    setShowViewModal,
    handlePageChange,
    handlePerPageChange,
    fetchTodosCumpleanos, // 🆕 Exportar función de cumpleaños
    fetchCarnet, // 🪪 Exportar función para obtener carnet virtual
    showCarnetModal, // 🆕
    setShowCarnetModal, // 🆕
    carnetData, // 🆕
  };
}
