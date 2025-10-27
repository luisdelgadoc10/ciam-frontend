import { useState, useEffect } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  assignPermissions,
} from "../api/services/rolesService";

export default function useRoles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", permissions: [] }); // ← "permissions", no "permisos"
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
      // La API ya devuelve: role.name y role.permissions (con "name" dentro)
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
      setPermissions(list); // Ya tiene .id y .name
    } catch (error) {
      console.error("Error fetching permissions:", error);
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
    // Extrae los IDs de role.permissions
    const permissionIds = role.permissions?.map(p => p.id) || [];
    setFormData({ name: role.name, permissions: permissionIds });
    setShowModal(true);
  };

  const handleView = (role) => {
    setSelectedRole(role); // role ya tiene .name y .permissions con .name
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este rol?")) return;
    await deleteRole(id);
    fetchRoles();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Nuevo handler para checkboxes de permisos
  const handlePermissionChange = (permissionId, checked) => {
    setFormData((prev) => {
      const current = prev.permissions || [];
      let updated;
      if (checked) {
        updated = [...current, permissionId];
      } else {
        updated = current.filter(id => id !== permissionId);
      }
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing && selectedRole) {
        await updateRole(selectedRole.id, { name: formData.name });
        if (formData.permissions?.length) {
          await assignPermissions(selectedRole.id, { permissions: formData.permissions });
        }
      } else {
        const { data } = await createRole({ name: formData.name });
        if (formData.permissions?.length && data?.id) {
          await assignPermissions(data.id, { permissions: formData.permissions });
        }
      }
      setShowModal(false);
      fetchRoles();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error al guardar rol:", error);
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
    handlePermissionChange, // ← Añadido
    handleSubmit,
    setShowModal,
    setShowViewModal,
  };
}