// src/pages/Actividades/ActividadesPage.jsx
import { useMemo } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Users,
  FileCheck,
} from "lucide-react";
import CustomTable from "../../components/ui/CustomTable";
import ModalActividad from "./components/ModalActividad";
import ModalInscritos from "./components/ModalInscritos";
import useActividades from "../../hooks/useActividades";

export default function ActividadesPage() {
  const {
    actividades,
    inscritos,
    adultosDisponibles,
    tipos,
    loading,
    selectedActividad,
    showModal,
    showInscritosModal,
    showInscribirModal,
    showViewModal,
    isEditing,
    formData,
    errors,
    // 🆕 Datos de paginación
    currentPage,
    lastPage,
    total,
    perPage,
    fetchActividades,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleVerInscritos,
    handleInscribir,
    handleInscribirAdulto,
    handleDesinscribir,
    handleFormChange,
    handleSubmit,
    handleDownloadAttendance,
    setShowModal,
    setShowViewModal,
    setShowInscritosModal,
    setShowInscribirModal,
    handleDownloadExcel,
    // 🆕 Funciones de paginación
    handlePageChange,
    handlePerPageChange,
  } = useActividades();

  const columns = useMemo(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "tipo_actividad.nombre",
        header: "Tipo",
        cell: (info) => info.row.original.tipo_actividad?.nombre || "N/A",
      },
      {
        accessorKey: "fecha_inicio",
        header: "Fecha Inicio",
        cell: (info) => {
          let rawDate = info.getValue();
          if (!rawDate) return "-";
          rawDate = rawDate.replace("Z", "");
          const date = new Date(rawDate);
          return date.toLocaleString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        },
      },
      {
        accessorKey: "capacidad",
        header: "Capacidad",
        cell: (info) => {
          const capacidad = info.getValue();
          const inscritos = info.row.original.inscritos_count || 0;
          return `${inscritos}/${capacidad}`;
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadAttendance(info.row.original)}
              className="text-indigo-600 hover:text-indigo-800 transition"
              title="Descargar Lista de Asistencia"
            >
              <FileCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleView(info.row.original)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleVerInscritos(info.row.original)}
              className="text-purple-600 hover:text-purple-800 transition"
              title="Ver inscritos"
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleInscribir(info.row.original)}
              className="text-green-600 hover:text-green-800 transition"
              title="Inscribir participante"
            >
              <UserPlus className="w-4 h-4" />
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
    [
      handleView,
      handleVerInscritos,
      handleInscribir,
      handleEdit,
      handleDelete,
      handleDownloadAttendance,
    ]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Actividades</h1>
          <p className="text-gray-600">Gestión de actividades del CIAM</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
        >
          <Calendar className="w-5 h-5" />
          Nueva Actividad
        </button>
      </div>

      {/* 🆕 Tabla con paginación del servidor */}
      <CustomTable
        data={actividades}
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

      {/* Modal de Actividad (crear/editar) */}
      <ModalActividad
        modo={isEditing ? "editar" : "crear"}
        show={showModal}
        onClose={() => setShowModal(false)}
        actividad={selectedActividad}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        tiposActividades={tipos}
        errors={errors}
        loading={loading}
      />

      {/* Modal de Vista (solo lectura) */}
      <ModalActividad
        modo="ver"
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        actividad={selectedActividad}
      />

      {/* Modal de Inscritos */}
      <ModalInscritos
        show={showInscritosModal || showInscribirModal}
        onClose={() => {
          setShowInscritosModal(false);
          setShowInscribirModal(false);
        }}
        actividad={selectedActividad}
        inscritos={inscritos}
        adultosDisponibles={adultosDisponibles}
        onInscribir={handleInscribirAdulto}
        onDesinscribir={handleDesinscribir}
        modo={showInscribirModal ? "inscribir" : "ver"}
        handleDownloadExcel={handleDownloadExcel}
      />
    </div>
  );
}