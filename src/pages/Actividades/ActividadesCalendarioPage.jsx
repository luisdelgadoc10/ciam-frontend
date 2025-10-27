import { useMemo } from "react";
import { Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalActividad from "./components/ModalActividad";
import ModalInscritos from "./components/ModalInscritos";
import useActividades from "../../hooks/useActividades";
import esLocale from "@fullcalendar/core/locales/es";

export default function ActividadesCalendarioPage() {
  const navigate = useNavigate();

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
    setShowModal,
    setShowViewModal,
    setShowInscritosModal,
    setShowInscribirModal,
  } = useActividades();

  // Mapear actividades al formato que usa FullCalendar
  const eventos = useMemo(
    () =>
      actividades.map((actividad) => ({
        id: actividad.id,
        title: actividad.nombre,
        start: actividad.fecha_inicio,
        end: actividad.fecha_fin || actividad.fecha_inicio, // si no hay fecha fin, usamos la misma
        backgroundColor: "#2563eb", // azul Tailwind 600
        borderColor: "#1d4ed8",
        textColor: "#fff",
        extendedProps: actividad, // guardamos toda la info
      })),
    [actividades]
  );

  // Click en un evento
  const handleEventClick = (info) => {
    const actividad = info.event.extendedProps;
    handleView(actividad);
  };

  // Doble click para editar
  const handleEventDoubleClick = (info) => {
    const actividad = info.event.extendedProps;
    handleEdit(actividad);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Calendario de Actividades
          </h1>
          <p className="text-gray-600">
            Visualiza y gestiona las actividades del CIAM en el calendario
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/actividades")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition"
          >
            <Calendar className="w-5 h-5" />
            Nueva Actividad
          </button>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[esLocale]}
          locale="es"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={eventos}
          eventClick={handleEventClick}
          eventDidMount={(info) => {
            const handleDbl = () => handleEventDoubleClick(info);
            info.el.addEventListener("dblclick", handleDbl);
            info.el._handleDbl = handleDbl; // guardamos para limpiar después
          }}
          eventWillUnmount={(info) => {
            if (info.el._handleDbl) {
              info.el.removeEventListener("dblclick", info.el._handleDbl);
              delete info.el._handleDbl;
            }
          }}
          height="80vh"
        />
      </div>

      {/* Modal Crear/Editar */}
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

      {/* Modal Ver */}
      <ModalActividad
        modo="ver"
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        actividad={selectedActividad}
      />

      {/* Modal Inscritos */}
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
      />
    </div>
  );
}
