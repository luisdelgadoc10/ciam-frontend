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
} from "../api/services/adultoMayorService";

export default function useAdultosMayores() {
  const [adultosMayores, setAdultosMayores] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [selectedAdulto, setSelectedAdulto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
    foto_url: null, // ✅ Para preview
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

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
      const { data } = await getAdultosMayores();
      const list = data.data || data;
      setAdultosMayores(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error al cargar adultos mayores:", error);
      setAdultosMayores([]);
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
    }
  };

  const fetchEstadosCiviles = async () => {
    try {
      const { data } = await getEstadosCiviles();
      setEstadosCiviles(data);
    } catch (error) {
      console.error("Error al cargar estados civiles:", error);
    }
  };

  const fetchParentescos = async () => {
    try {
      const { data } = await getParentescos();
      setParentescos(data);
    } catch (error) {
      console.error("Error al cargar parentescos:", error);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedAdulto(null); // ✅ Limpiar selección
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
      foto_url: null, // ✅ Sin preview
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (adulto) => {
    setIsEditing(true);
    setSelectedAdulto(adulto);

    // 🔍 DEBUG: Ver qué tiene el adulto
    console.log("=== Adulto a editar ===", adulto);

    // Construir URL completa si es necesario
    let fotoUrl =
      adulto.foto_url ||
      adulto.foto ||
      adulto.imagen ||
      adulto.imagen_url ||
      null;
    if (fotoUrl && !fotoUrl.startsWith("http")) {
      // Si es una ruta relativa, construir URL completa
      fotoUrl = `https://ciam.api.munimoche.gob.pe${fotoUrl}`;
    }

    console.log("📷 URL de foto construida:", fotoUrl);

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
    // Construir URL completa para la foto como en el form
    let fotoUrl =
      adulto.foto_url ||
      adulto.foto ||
      adulto.imagen ||
      adulto.imagen_url ||
      null;
    if (fotoUrl && !fotoUrl.startsWith("http")) {
      fotoUrl = `https://ciam.api.munimoche.gob.pe/${fotoUrl}`;
    }

    setSelectedAdulto({
      ...adulto,
      foto_url: fotoUrl,
    });
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este adulto mayor?")) return;

    try {
      setLoading(true);
      await deleteAdultoMayor(id);
      await fetchAdultosMayores();
      alert("Adulto Mayor eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el Adulto Mayor");
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

      // Agregar todos los campos
      Object.entries(formData).forEach(([key, value]) => {
        // Omitir foto_url (solo es para preview)
        if (key === "foto_url") return;

        // 🔧 FIX: Si estamos editando y el DNI no cambió, no lo enviamos
        if (isEditing && key === "dni" && selectedAdulto?.dni === value) {
          return;
        }

        if (key === "foto") {
          // Solo agregar si es un File real
          if (value instanceof File) {
            fd.append("foto", value);
          }
        } else {
          // Solo agregar si tiene valor
          if (value !== null && value !== undefined && value !== "") {
            fd.append(key, value);
          }
        }
      });

      if (isEditing) {
        // ✅ Actualizar
        fd.append("_method", "PUT");

        // 🔍 DEBUG: Ver qué se está enviando
        console.log("=== FormData a enviar ===");
        for (let pair of fd.entries()) {
          console.log(pair[0] + ": ", pair[1]);
        }

        await updateAdultoMayor(selectedAdulto.id, fd);
        alert("Adulto Mayor actualizado exitosamente");
      } else {
        // ✅ Crear
        await createAdultoMayor(fd);
        alert("Adulto Mayor registrado exitosamente");
      }

      setShowModal(false);
      await fetchAdultosMayores();
    } catch (error) {
      if (error.response?.status === 422) {
        // 🔍 DEBUG: Ver errores de validación
        console.error("❌ Errores de validación:", error.response.data);
        setErrors(error.response.data.errors || {});

        // Mostrar errores en alert
        const errorMessages = Object.entries(error.response.data.errors || {})
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        alert(`Errores de validación:\n\n${errorMessages}`);
      } else {
        alert(
          `Error al ${isEditing ? "actualizar" : "registrar"} el Adulto Mayor`
        );
      }
      console.error("Error completo:", error.response || error);
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
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleFormChange,
    handleSubmit,
    setShowModal,
    setShowViewModal,
  };
}
