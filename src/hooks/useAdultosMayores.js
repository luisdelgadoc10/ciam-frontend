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
    parentesco_id: ""
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
      fetchParentescos()
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
      parentesco_id: ""
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (adulto) => {
    setIsEditing(true);
    setSelectedAdulto(adulto);
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
      contacto_emergencia_apellidos: adulto.contacto_emergencia?.apellidos || "",
      contacto_emergencia_telefono: adulto.contacto_emergencia?.telefono || "",
      parentesco_id: adulto.contacto_emergencia?.parentesco?.id || ""
    });
    setShowModal(true);
  };

  const handleView = (adulto) => {
    setSelectedAdulto(adulto);
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      setLoading(true);
      
      if (isEditing && selectedAdulto) {
        await updateAdultoMayor(selectedAdulto.id, formData);
        alert("Adulto Mayor actualizado exitosamente");
      } else {
        await createAdultoMayor(formData);
        alert("Adulto Mayor registrado exitosamente");
      }
      
      setShowModal(false);
      await fetchAdultosMayores();
      
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert(`Error al ${isEditing ? 'actualizar' : 'registrar'} el Adulto Mayor`);
      }
      console.error("Error:", error);
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