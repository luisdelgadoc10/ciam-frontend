import { useMemo } from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import CustomTable from "../../components/ui/CustomTable";
import ModalUsuario from "./components/ModalUsuario";
import useUsuarios from "../../hooks/useUsuarios";

// 🆕 IMPORTAR PERMISSION GATE
import PermissionGate from "../../components/PermissionGate";

export default function UsuariosPage() {
  const {
    usuarios,
    roles,
    selectedUsuario,
    formData,
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
  } = useUsuarios();

  const columns = useMemo(
    () => [
      {
        accessorKey: "nombre_completo",
        header: "Nombre",
        cell: ({ row }) =>
          `${row.original.nombre || ""} ${
            row.original.apellido || ""
          }`.trim() || "-",
      },
      {
        accessorKey: "email",
        header: "Correo",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: (info) =>
          info.row.original.roles?.map((r) => r.name).join(", ") || "Sin roles",
      },
      {
        accessorKey: "created_at",
        header: "Creado el",
        cell: (info) => {
          const raw = info.getValue();
          if (!raw) return "-";

          let date;
          if (typeof raw === "string") {
            const clean = raw.substring(0, 19).replace(" ", "T");
            const [datePart, timePart] = clean.split("T");
            if (datePart && timePart) {
              const [y, m, d] = datePart.split("-").map(Number);
              const [h, min] = timePart.split(":").map(Number);
              date = new Date(y, m - 1, d, h, min);
            }
          } else if (raw?.date) {
            const [datePart, timePart] = raw.date.split(" ");
            if (datePart && timePart) {
              const [y, m, d] = datePart.split("-").map(Number);
              const [h, min] = timePart.split(":").map(Number);
              date = new Date(y, m - 1, d, h, min);
            }
          }

          if (!date || isNaN(date.getTime())) {
            date = new Date(raw);
          }
          if (isNaN(date?.getTime())) return "Inválida";

          return date.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: (info) => (
          <div className="flex gap-2">

            {/* 🟦 Ver usuario */}
            <PermissionGate permission="ver-detalle-usuario">
              <button
                onClick={() => handleView(info.row.original)}
                className="text-blue-600 hover:text-blue-800 transition"
                title="Ver"
              >
                <Eye className="w-4 h-4" />
              </button>
            </PermissionGate>

            {/* 🟨 Editar usuario */}
            <PermissionGate permission="editar-usuario">
              <button
                onClick={() => handleEdit(info.row.original)}
                className="text-yellow-600 hover:text-yellow-800 transition"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            </PermissionGate>

            {/* 🟥 Eliminar usuario */}
            <PermissionGate permission="eliminar-usuario">
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
    [handleView, handleEdit, handleDelete, handleResetPassword]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
          <p className="text-gray-600">Gestión de usuarios del sistema</p>
        </div>

        {/* 🆕 Botón con permiso */}
        <PermissionGate permission="crear-usuario">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </PermissionGate>
      </div>

      {/* Tabla */}
      <CustomTable data={usuarios} columns={columns} searchable={true} />

      {/* Modal Crear/Editar */}
      <ModalUsuario
        show={showModal}
        onClose={() => setShowModal(false)}
        modo={isEditing ? "editar" : "crear"}
        formData={formData}
        roles={roles}
        onChange={handleFormChange}
        onRoleChange={handleRoleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Modal Ver */}
      <ModalUsuario
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        modo="ver"
        formData={selectedUsuario}
      />
    </div>
  );
}
