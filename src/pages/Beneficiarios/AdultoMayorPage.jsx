// src/pages/Beneficiarios/AdultoMayorPage.jsx
import { useMemo } from "react";
import { UserPlus, Edit, Trash2, Eye, QrCode, ListChecks } from "lucide-react";
import CustomTable from "../../components/ui/CustomTable";
import ModalAdultoForm from "./components/ModalAdultoForm";
import ModalAdultoView from "./components/ModalAdultoView";
import ModalCarnet from "./components/ModalCarnet";
import useAdultosMayores from "../../hooks/useAdultosMayores";
import PermissionGate from "../../components/PermissionGate";
import ModalAsignarProgramas from "./components/ModalAsignarProgramas";

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
    currentPage,
    lastPage,
    total,
    perPage,
    showProgramasModal,
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
    showCarnetModal,
    setShowCarnetModal,
    setShowProgramasModal,
    setSelectedAdulto,
    carnetData,
    fetchCarnet,
    tiposCategorias,
    assignCategoria,
    removeCategoria,
  } = useAdultosMayores();

  const handleOpenProgramas = (adulto) => {
    setSelectedAdulto(adulto);
    setShowProgramasModal(true);
  };
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

      // ACCIONES + PERMISSIONS
      {
        id: "acciones",
        header: "Acciones",
        cell: (info) => (
          <div className="flex gap-2">
            {/* Ver */}
            <PermissionGate permission="ver-detalle-adulto">
              <button
                onClick={() => handleView(info.row.original)}
                className="text-blue-600 hover:text-blue-800 transition"
                title="Ver detalles"
              >
                <Eye className="w-4 h-4" />
              </button>
            </PermissionGate>

            {/* Carnet */}
            <button
              onClick={() => fetchCarnet(info.row.original.id)}
              className="text-green-600 hover:text-green-800 transition"
              title="Carnet Virtual"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Programas Sociales */}
            <button
              onClick={() => handleOpenProgramas(info.row.original)}
              className="text-purple-600 hover:text-purple-800 transition"
              title="Asignar Programas Sociales"
            >
              <ListChecks className="w-4 h-4" />
            </button>

            {/* Editar */}
            <PermissionGate permission="editar-adulto">
              <button
                onClick={() => handleEdit(info.row.original)}
                className="text-yellow-600 hover:text-yellow-800 transition"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            </PermissionGate>

            {/* Eliminar */}
            <PermissionGate permission="eliminar-adulto">
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
          <h1 className="text-2xl font-bold text-gray-800">Adultos Mayores</h1>
          <p className="text-gray-600">Gestión de beneficiarios del CIAM</p>
          <p className="text-sm text-gray-500 mt-1">
            Total de registros: {total}
          </p>
        </div>

        {/* CREAR + PERMISSION */}
        <PermissionGate permission="crear-adulto">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
          >
            <UserPlus className="w-5 h-5" />
            Nuevo Adulto Mayor
          </button>
        </PermissionGate>
      </div>

      {/* Tabla */}
      <CustomTable
        data={adultosMayores}
        columns={columns}
        searchable={true}
        serverPagination={true}
        currentPage={currentPage}
        lastPage={lastPage}
        total={total}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        loading={loading}
      />

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

      {/* Modal Ver */}
      <ModalAdultoView
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        adulto={selectedAdulto}
        onEdit={handleEdit}
      />

      {/* Carnet Virtual */}
      <ModalCarnet
        show={showCarnetModal}
        onClose={() => setShowCarnetModal(false)}
        carnet={carnetData}
      />

      <ModalAsignarProgramas
        show={showProgramasModal}
        onClose={() => setShowProgramasModal(false)}
        adulto={selectedAdulto}
        programas={tiposCategorias} // viene del hook
        assignCategoria={assignCategoria}
        removeCategoria={removeCategoria}
        loading={loading}
      />
    </div>
  );
}
