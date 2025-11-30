// src/pages/Roles/RolesPage.jsx
import { useMemo } from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import CustomTable from "../../components/ui/CustomTable";
import ModalRol from "./components/ModalRol";
import useRoles from "../../hooks/useRoles";
import PermissionGate from "../../components/PermissionGate";

export default function RolesPage() {
  const {
    roles,
    selectedRole,
    formData,
    permissions,
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
  } = useRoles();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "permissions",
        header: "Permisos",
        cell: (info) =>
          info.row.original.permissions?.map((p) => p.name).join(", ") || "-",
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: (info) => (
          <div className="flex gap-2">
            {/* 🔵 Ver */}
            <PermissionGate permission="ver-detalle-rol">
              <button
                onClick={() => handleView(info.row.original)}
                className="text-blue-600 hover:text-blue-800 transition"
                title="Ver"
              >
                <Eye className="w-4 h-4" />
              </button>
            </PermissionGate>

            {/* 🟡 Editar */}
            <PermissionGate permission="editar-rol">
              <button
                onClick={() => handleEdit(info.row.original)}
                className="text-yellow-600 hover:text-yellow-800 transition"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            </PermissionGate>

            {/* 🔴 Eliminar */}
            <PermissionGate permission="eliminar-rol">
              <button
                onClick={() => handleDelete(info.row.original.id)}
                className="text-red-600 hover:text-red-800 transition"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [handleView, handleEdit, handleDelete]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Roles</h1>
          <p className="text-gray-600">Gestión de roles y permisos</p>
        </div>

        {/* 🟢 Crear nuevo rol */}
        <PermissionGate permission="crear-rol">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Rol
          </button>
        </PermissionGate>
      </div>

      {/* Tabla */}
      <CustomTable data={roles} columns={columns} searchable={true} />

      {/* Modal Crear/Editar */}
      <ModalRol
        show={showModal}
        onClose={() => setShowModal(false)}
        modo={isEditing ? "editar" : "crear"}
        formData={formData}
        permissions={permissions}
        onChange={handleFormChange}
        onPermissionChange={handlePermissionChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Modal Ver */}
      <ModalRol
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        modo="ver"
        formData={selectedRole}
      />
    </div>
  );
}
