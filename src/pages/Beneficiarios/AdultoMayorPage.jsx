// src/pages/Beneficiarios/AdultoMayorPage.jsx
import { useMemo } from "react";
import { UserPlus, Edit, Trash2, Eye } from "lucide-react";
import CustomTable from "../../components/ui/CustomTable";
import ModalAdultoForm from "./components/ModalAdultoForm";
import ModalAdultoView from "./components/ModalAdultoView";
import useAdultosMayores from "../../hooks/useAdultosMayores";

export default function AdultoMayorPage() {
  const {
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
  } = useAdultosMayores();

  const columns = useMemo(
    () => [
      {
        accessorKey: "dni",
        header: "DNI",
        cell: (info) => info.getValue(),
      },
      {
        header: "Nombre Completo",
        accessorFn: (row) =>
          `${row.nombres || ""} ${row.apellidos || ""}`.trim(),
        cell: ({ getValue }) => {
          const nombreCompleto = getValue();
          return nombreCompleto || "Sin nombre registrado";
        },
      },
      {
        accessorKey: "sexo.nombre",
        header: "Sexo",
        cell: (info) => info.row.original.sexo?.nombre || "N/A",
      },
      {
        accessorKey: "estado_civil.nombre",
        header: "Estado Civil",
        cell: (info) => info.row.original.estado_civil?.nombre || "N/A",
      },
      {
        accessorKey: "celular",
        header: "Celular",
        cell: (info) => info.getValue(),
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(info.row.original)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="text-yellow-600 hover:text-yellow-800 transition"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="text-red-600 hover:text-red-800 transition"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
          <h1 className="text-2xl font-bold text-gray-800">Adultos Mayores</h1>
          <p className="text-gray-600">Gestión de beneficiarios del CIAM</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Adulto Mayor
        </button>
      </div>

      {/* Tabla */}
      <CustomTable data={adultosMayores} columns={columns} searchable={true} />

      {/* Modal Crear/Editar */}
      <ModalAdultoForm
        show={showModal}
        onClose={() => setShowModal(false)}
        modo={isEditing ? "editar" : "crear"}
        formData={formData}
        errors={errors}
        sexos={sexos}
        estadosCiviles={estadosCiviles}
        parentescos={parentescos}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Modal Ver (solo lectura) */}
      <ModalAdultoView
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        adulto={selectedAdulto}
        onEdit={handleEdit}
      />
    </div>
  );
}
