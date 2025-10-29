import { useState, useEffect } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  assignRoles,
} from "../api/services/usuariosService";

import { getRoles } from "../api/services/rolesService";

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]); // lista de roles disponibles
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "", // agregar
    fecha_de_nacimiento: "", // agregar
    password: "",
    password_confirmation: "", // agregar si el backend lo requiere
    roles: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchUsuarios(), fetchRolesList()]);
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const result = await getUsuarios(); // ya procesado en el servicio

      let list;
      if (Array.isArray(result)) {
        list = result;
      } else if (result && Array.isArray(result.data)) {
        list = result.data;
      } else {
        console.error("Formato inesperado en usuarios:", result);
        list = [];
      }
      setUsuarios(list);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesList = async () => {
    try {
      const { data } = await getRoles(); // sin procesar en el servicio

      let list;
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.data)) {
        list = data.data;
      } else {
        list = [];
      }
      setRoles(list);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      roles: [],
    });
    setShowModal(true);
  };

  const handleEdit = (usuario) => {
    setIsEditing(true);
    setSelectedUsuario(usuario);
    const roleIds = usuario.roles?.map((r) => r.id) || [];
    setFormData({
      id: usuario.id,
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      email: usuario.email || "",
      password: "", // no se rellena al editar (solo si se quiere cambiar)
      roles: roleIds,
    });
    setShowModal(true);
  };

  const handleView = (usuario) => {
    setSelectedUsuario(usuario); // contiene roles como objetos con .name
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    try {
      await deleteUsuario(id);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleResetPassword = (id) => {
    alert(
      `Resetear contraseña del usuario ID ${id} (pendiente de implementar)`
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleChange = (roleId, checked) => {
    setFormData((prev) => {
      const current = prev.roles || [];
      let updated;
      if (checked) {
        updated = [...current, roleId];
      } else {
        updated = current.filter((id) => id !== roleId);
      }
      return { ...prev, roles: updated };
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  try {
    // 🧠 Normalizar datos antes de enviar
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      usuario: formData.usuario,
      fecha_de_nacimiento: formData.fecha_de_nacimiento,
      password: formData.password || undefined,
      password_confirmation: formData.password_confirmation || undefined,
    };

    if (isEditing && selectedUsuario) {
      // 1️⃣ Actualizar datos básicos del usuario
      await updateUsuario(selectedUsuario.id, payload);

      // 2️⃣ Asignar roles después de actualizar
      if (formData.roles && formData.roles.length > 0) {
        await assignRoles(selectedUsuario.id, formData.roles);
      } else {
        // Si no tiene roles seleccionados, enviar arreglo vacío para "revocar" roles
        await assignRoles(selectedUsuario.id, []);
      }

    } else {
      // Crear nuevo usuario
      const nuevo = await createUsuario(payload);
      // Si se asignan roles al crear, también se hace aquí
      if (formData.roles && formData.roles.length > 0) {
        await assignRoles(nuevo.id, formData.roles);
      }
    }

    setShowModal(false);
    await fetchUsuarios();
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    }
  } finally {
    setLoading(false);
  }
};


  return {
    usuarios,
    roles, // roles disponibles para el select/checkboxes
    selectedUsuario,
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
    handleResetPassword,
    handleFormChange,
    handleRoleChange,
    handleSubmit,
    setShowModal,
    setShowViewModal,
  };
}
