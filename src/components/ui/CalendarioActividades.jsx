import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

// 🎨 Paleta moderna por tipo de actividad
const getColorByTipo = (tipoId) => {
  const colors = {
    1: "#2563eb", // azul intenso
    2: "#16a34a", // verde esmeralda
    3: "#f59e0b", // ámbar cálido
    4: "#dc2626", // rojo moderno
    5: "#8b5cf6", // violeta
  };
  return colors[tipoId] || "#6b7280"; // gris neutro por defecto
};

export default function CalendarioActividades({ actividades }) {
  const eventos = actividades.map((actividad) => ({
    id: actividad.id,
    title: actividad.nombre,
    start: actividad.fecha_inicio,
    end: actividad.fecha_fin || actividad.fecha_inicio,
    backgroundColor: getColorByTipo(actividad.tipo_actividad_id),
    borderColor: getColorByTipo(actividad.tipo_actividad_id),
    textColor: "#ffffff",
    extendedProps: actividad,
  }));

  const handleEventClick = (info) => {
    const actividad = info.event.extendedProps;
    alert(`Actividad: ${actividad.nombre}`);
  };

  const handleEventDoubleClick = (info) => {
    const actividad = info.event.extendedProps;
    alert(`Editar: ${actividad.nombre}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📅</span> Calendario de Actividades
        </h2>
        <span className="text-sm text-blue-100 italic">
          Doble clic para editar | Clic para ver detalles
        </span>
      </div>

      {/* Contenedor del calendario */}
      <div className="p-3 md:p-6 bg-gray-50">
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
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
              info.el._handleDbl = handleDbl;
            }}
            eventWillUnmount={(info) => {
              if (info.el._handleDbl) {
                info.el.removeEventListener("dblclick", info.el._handleDbl);
                delete info.el._handleDbl;
              }
            }}
            height="80vh"
            dayMaxEventRows={3}
            nowIndicator={true}
            selectable={true}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            titleFormat={{ year: "numeric", month: "long" }}
          />
        </div>
      </div>
    </div>
  );
}
