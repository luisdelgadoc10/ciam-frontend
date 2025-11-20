import { useState, useEffect } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  assignPermissions,
} from "../api/services/rolesService";

import { useConfirmDialog } from "../context/ConfirmProvider";
import { useToastContext } from "../context/ToastProvider"; // ⬅️ AÑADIDO

export default function useRoles() {
  const { ask } = useConfirmDialog();
  const { success, error: toastError, warning } = useToastContext(); // ⬅️ TOASTS

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", permissions: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchRoles(), fetchPermissions()]);
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await getRoles();

      const list = Array.isArray(data) ? data : data.data || data;
      setRoles(list);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data } = await getPermissions();
      const list = Array.isArray(data) ? data : data.data || data;
      setPermissions(list);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toastError("No se pudieron cargar los permisos.");
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ name: "", permissions: [] });
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setIsEditing(true);
    setSelectedRole(role);

    const permissionIds = role.permissions?.map((p) => p.id) || [];
    setFormData({ name: role.name, permissions: permissionIds });

    setShowModal(true);
  };

  const handleView = (role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await ask({
      title: "Eliminar rol",
      message: "¿Deseas eliminar este rol? Esta acción no se puede deshacer.",
    });

    if (!confirmed) return;

    try {
      await deleteRole(id);
      await fetchRoles();
      success("Rol eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      toastError("No se pudo eliminar el rol");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData((prev) => {
      const current = prev.permissions || [];
      let updated = checked
        ? [...current, permissionId]
        : current.filter((id) => id !== permissionId);

      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing && selectedRole) {
        // EDITAR
        await updateRole(selectedRole.id, { name: formData.name });

        if (formData.permissions?.length) {
          await assignPermissions(selectedRole.id, {
            permissions: formData.permissions,
          });
        }

        success("Rol actualizado correctamente");
      } else {
        // CREAR
        const { data } = await createRole({ name: formData.name });

        if (formData.permissions?.length && data?.id) {
          await assignPermissions(data.id, {
            permissions: formData.permissions,
          });
        }

        success("Rol creado correctamente");
      }

      setShowModal(false);
      await fetchRoles();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toastError("Corrige los errores del formulario");
      } else {
        console.error("Error al guardar rol:", error);
        toastError("No se pudo guardar el rol");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    permissions,
    selectedRole,
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
    handlePermissionChange,
    handleSubmit,
    setShowModal,
    setShowViewModal,
  };
}
