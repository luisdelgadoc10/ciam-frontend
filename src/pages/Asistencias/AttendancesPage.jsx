// src/pages/Asistencias/AttendancesPage.jsx
import { useMemo } from "react";
import { Plus, Edit, Trash2, Eye, Filter, X, AlertCircle } from "lucide-react";
import CustomTable from "../../components/ui/CustomTable";
import ModalAttendanceForm from "./components/ModalAttendanceForm";
import ModalAttendanceView from "./components/ModalAttendanceView";
import useAttendances from "../../hooks/useAttendances";

export default function AttendancesPage() {
  const {
    attendances,
    activities,
    adultosMayores,
    inscritosActividad,
    selectedAttendance,
    formData,
    setFormData,
    errors,
    loading,
    showModal,
    showViewModal,
    isEditing,
    filterType,
    selectedFilter,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleFormChange,
    handleSubmit,
    handleClearFilter,
    fetchAttendancesByActivity,
    fetchAttendancesByAdultoMayor,
    setShowModal,
    setShowViewModal,
  } = useAttendances();

  const getEstadoBadge = (status) => {
    const badges = {
      asistió:
        "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium",
      falta:
        "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium",
      tardanza:
        "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium",
      justificado:
        "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium",
    };
    return (
      badges[status] ||
      "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
    );
  };

  const getEstadoLabel = (status) => {
    const labels = {
      asistió: "Asistió",
      falta: "Falta",
      tardanza: "Tardanza",
      justificado: "Justificado",
    };
    return labels[status] || status;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "attendance_date",
        header: "Fecha",
        cell: (info) => {
          const fecha = info.getValue();
          return fecha ? new Date(fecha).toLocaleDateString("es-PE") : "N/A";
        },
      },
      {
        accessorKey: "activity",
        header: "Actividad",
        cell: (info) => info.row.original.activity?.nombre || "N/A",
      },
      {
        accessorKey: "adulto_mayor",
        header: "Adulto Mayor",
        cell: (info) => {
          const adulto = info.row.original.adulto_mayor;
          return adulto ? `${adulto.nombres} ${adulto.apellidos}` : "N/A";
        },
      },
      {
        accessorKey: "adulto_mayor.dni",
        header: "DNI",
        cell: (info) => info.row.original.adulto_mayor?.dni || "N/A",
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span className={getEstadoBadge(status)}>
              {getEstadoLabel(status)}
            </span>
          );
        },
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
            {/* <button
              onClick={() => handleEdit(info.row.original)}
              className="text-yellow-600 hover:text-yellow-800 transition"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button> */}
            {/* <button
              onClick={() => handleDelete(info.row.original.id)}
              className="text-red-600 hover:text-red-800 transition"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button> */}
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
          <h1 className="text-2xl font-bold text-gray-800">Asistencias</h1>
          <p className="text-gray-600">
            Gestión de asistencias de los adultos mayores
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
        >
          <Plus className="w-5 h-5" />
          Nueva Asistencia
        </button>
      </div>

      {/* Alerta informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Información importante:</p>
          <p>
            Para visualizar las asistencias, primero debes aplicar un filtro por
            actividad o por adulto mayor utilizando los selectores de abajo.
          </p>
        </div>
      </div>

      {/* Filtros - SIEMPRE VISIBLES */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filtrar Asistencias
        </h3>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          {/* Filtro por Actividad */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Por Actividad
            </label>
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  fetchAttendancesByActivity(value);
                } else {
                  handleClearFilter();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType === "activity" ? selectedFilter : ""}
            >
              <option value="">Selecciona una actividad</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.nombre || activity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Adulto Mayor
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Por Adulto Mayor
            </label>
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  fetchAttendancesByAdultoMayor(value);
                } else {
                  handleClearFilter();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType === "adulto" ? selectedFilter : ""}
            >
              <option value="">Selecciona un adulto mayor</option>
              {adultosMayores.map((adulto) => (
                <option key={adulto.id} value={adulto.id}>
                  {adulto.nombres} {adulto.apellidos} - {adulto.dni}
                </option>
              ))}
            </select>
          </div> */}

          {/* Botón Limpiar */}
          {filterType && selectedFilter && (
            <button
              onClick={handleClearFilter}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        {/* Indicador de filtro activo */}
        {filterType && selectedFilter && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✓ Filtro activo:</strong>{" "}
              {filterType === "activity" ? (
                <>
                  Actividad -{" "}
                  <span className="font-semibold">
                    {activities.find((a) => a.id === selectedFilter)?.nombre ||
                      activities.find((a) => a.id === selectedFilter)?.name ||
                      ""}
                  </span>
                </>
              ) : (
                <>
                  Adulto Mayor -{" "}
                  <span className="font-semibold">
                    {adultosMayores.find((a) => a.id === selectedFilter)
                      ?.nombres || ""}{" "}
                    {adultosMayores.find((a) => a.id === selectedFilter)
                      ?.apellidos || ""}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Tabla o mensaje */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="text-gray-600 mt-4">Cargando asistencias...</p>
        </div>
      ) : !filterType || !selectedFilter ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sin filtro aplicado
          </h3>
          <p className="text-gray-500">
            Selecciona una actividad o un adulto mayor en los filtros de arriba
            para ver las asistencias.
          </p>
        </div>
      ) : attendances.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CustomTable data={attendances} columns={columns} searchable={true} />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay asistencias registradas
          </h3>
          <p className="text-gray-500">
            No se encontraron asistencias para el filtro seleccionado.
          </p>
        </div>
      )}

      {/* Modal Crear/Editar */}
      <ModalAttendanceForm
        show={showModal}
        onClose={() => setShowModal(false)}
        modo={isEditing ? "editar" : "crear"}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        activities={activities}
        inscritosActividad={inscritosActividad}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Modal Ver (solo lectura) */}
      <ModalAttendanceView
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        attendance={selectedAttendance}
        onEdit={handleEdit}
      />
    </div>
  );
}
