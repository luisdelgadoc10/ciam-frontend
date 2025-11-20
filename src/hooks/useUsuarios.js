// src/hooks/useUsuarios.js
import { useState, useEffect } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  assignRoles,
} from "../api/services/usuariosService";

import { getRoles } from "../api/services/rolesService";
import { useConfirmDialog } from "../context/ConfirmProvider";
import { useToastContext } from "../context/ToastProvider";

export default function useUsuarios() {
  const { ask } = useConfirmDialog();
  const { success, error: toastError, warning } = useToastContext();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    fecha_de_nacimiento: "",
    password: "",
    password_confirmation: "",
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
      const result = await getUsuarios();

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
      const { data } = await getRoles();

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
      usuario: "",
      fecha_de_nacimiento: "",
      password: "",
      password_confirmation: "",
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
      usuario: usuario.usuario || "",
      fecha_de_nacimiento: usuario.fecha_de_nacimiento || "",
      password: "",
      password_confirmation: "",
      roles: roleIds,
    });

    setShowModal(true);
  };

  const handleView = (usuario) => {
    setSelectedUsuario(usuario);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await ask({
      title: "Eliminar usuario",
      message:
        "¿Deseas eliminar este usuario? Esta acción no se puede deshacer.",
      variant: "error",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      await deleteUsuario(id);
      await fetchUsuarios();
      success("Usuario eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      toastError("No se pudo eliminar el usuario");
    }
  };

  const handleResetPassword = async (id) => {
    const confirmed = await ask({
      title: "Reiniciar contraseña",
      message:
        "Se generará una nueva contraseña temporal para este usuario. ¿Continuar?",
    });

    if (!confirmed) return;

    warning("Funcionalidad pendiente de implementación");
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
        // EDITAR
        await updateUsuario(selectedUsuario.id, payload);

        await assignRoles(
          selectedUsuario.id,
          formData.roles?.length ? formData.roles : []
        );

        success("Usuario actualizado correctamente");
      } else {
        // CREAR
        const nuevo = await createUsuario(payload);

        if (formData.roles?.length > 0) {
          await assignRoles(nuevo.id, formData.roles);
        }

        success("Usuario creado correctamente");
      }

      setShowModal(false);
      await fetchUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        toastError("Hay errores en el formulario");
      } else {
        toastError("No se pudo guardar");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    roles,
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
