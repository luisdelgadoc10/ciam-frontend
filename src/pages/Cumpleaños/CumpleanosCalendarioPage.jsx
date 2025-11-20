// src/pages/Cumpleanos/CumpleanosCalendarioPage.jsx
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Cake, Gift, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useAdultosMayores from "../../hooks/useAdultosMayores";

export default function CumpleanosCalendarioPage() {
  const navigate = useNavigate();
  const { fetchTodosCumpleanos } = useAdultosMayores();
  const [adultosMayores, setAdultosMayores] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const cargarCumpleanos = async () => {
      setLoading(true);
      const cumpleanos = await fetchTodosCumpleanos();
      setAdultosMayores(cumpleanos);
      setLoading(false);
    };
    cargarCumpleanos();
  }, []);

  const eventosCumple = useMemo(() => {
    return adultosMayores
      .filter((a) => a.fecha_nacimiento)
      .map((adulto) => {
        const [birthYear, birthMonth, birthDay] = adulto.fecha_nacimiento
          .split("-")
          .map(Number);
        const fecha = new Date(currentYear, birthMonth - 1, birthDay);
        return {
          id: adulto.id,
          start: fecha,
          allDay: true,
          extendedProps: { adulto },
        };
      });
  }, [adultosMayores, currentYear]);

  const getGradientBySexo = (sexo_id) => {
    switch (sexo_id) {
      case 1: return "linear-gradient(135deg, #2563EB, #1E40AF)";
      case 2: return "linear-gradient(135deg, #EC4899, #BE185D)";
      case 3: return "linear-gradient(135deg, #6B7280, #374151)";
      default: return "linear-gradient(135deg, #2563EB, #1E40AF)";
    }
  };

  const getBorderBySexo = (sexo_id) => {
    switch (sexo_id) {
      case 1: return "2px solid #2563EB";
      case 2: return "2px solid #EC4899";
      case 3: return "2px solid #6B7280";
      default: return "2px solid #2563EB";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Cargando cumpleaños...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="w-6 h-6 text-blue-600" />
            Calendario de Cumpleaños
          </h1>
          <p className="text-gray-600">
            Visualiza los cumpleaños de {adultosMayores.length} Adultos Mayores
          </p>
        </div>
        <button
          onClick={() => navigate("/adultos-mayores")}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      {/* Calendario */}
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[esLocale]}
          locale="es"
          height="80vh"
          events={eventosCumple}
          dayMaxEventRows={3}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          eventContent={(eventInfo) => {
            const adulto = eventInfo.event.extendedProps.adulto;
            const [birthYear, birthMonth, birthDay] =
              adulto.fecha_nacimiento.split("-").map(Number);
            const nacimiento = new Date(currentYear, birthMonth - 1, birthDay);
            const edad = currentYear - birthYear;
            const sexoId = adulto.sexo?.id || 0;

            const hasPhoto =
              adulto.foto_url || adulto.foto || adulto.imagen || adulto.imagen_url;

            return (
              <div className="relative group inline-flex items-center">
                {/* Imagen o Icono */}
                <div
                  tabIndex={0}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    document.documentElement.style.setProperty(
                      "--tooltip-x",
                      `${rect.left + rect.width / 2}px`
                    );
                    document.documentElement.style.setProperty(
                      "--tooltip-y",
                      `${rect.top}px`
                    );
                  }}
                  className="w-14 h-14 rounded-full overflow-hidden shadow-md cursor-pointer flex items-center justify-center bg-gray-200"
                  style={{ border: getBorderBySexo(sexoId) }}
                >
                  {hasPhoto ? (
                    <img
                      src={
                        adulto.foto_url ||
                        adulto.foto ||
                        adulto.imagen ||
                        adulto.imagen_url
                      }
                      alt={`${adulto.nombres} ${adulto.apellidos}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      className={`w-8 h-8 ${
                        sexoId === 1
                          ? "text-blue-600"
                          : sexoId === 2
                          ? "text-pink-500"
                          : "text-gray-500"
                      }`}
                    />
                  )}
                </div>

                {/* Tooltip */}
                <div
                  className="fixed pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 ease-in-out z-[9999]"
                  style={{
                    top: "var(--tooltip-y)",
                    left: "var(--tooltip-x)",
                    transform: "translate(-50%, -140%)",
                  }}
                >
                  <div
                    className="px-4 py-3 rounded-xl backdrop-blur-[8px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] border border-white/20 text-white w-max max-w-[260px] flex items-center gap-3 transition-all duration-300 group-hover:scale-105 group-focus:scale-105 group-hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.5)]"
                    style={{ background: getGradientBySexo(sexoId) }}
                  >
                    <div className="relative flex-shrink-0">
                      {hasPhoto ? (
                        <img
                          src={
                            adulto.foto_url ||
                            adulto.foto ||
                            adulto.imagen ||
                            adulto.imagen_url
                          }
                          alt={`${adulto.nombres} ${adulto.apellidos}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-inner ring-2 ring-white/30"
                          style={{ border: getBorderBySexo(sexoId) }}
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/30 shadow-inner ring-2 ring-white/30 ${
                            sexoId === 1
                              ? "bg-blue-200"
                              : sexoId === 2
                              ? "bg-pink-200"
                              : "bg-gray-300"
                          }`}
                        >
                          <User
                            className={`w-6 h-6 ${
                              sexoId === 1
                                ? "text-blue-600"
                                : sexoId === 2
                                ? "text-pink-500"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs text-white font-bold shadow-md ring-2 ring-white">
                        <Cake className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="font-semibold text-sm truncate">
                        {adulto.nombres} {adulto.apellidos}
                      </span>
                      <span className="text-xs font-medium flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse mr-1"></span>
                        Cumple {edad} años
                      </span>
                      <span className="text-[11px] mt-0.5 text-white/80">
                        {`${birthDay} de ${nacimiento.toLocaleString("es-ES", {
                          month: "long",
                        })} de ${currentYear}`}
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 mt-1"
                    style={{ background: getGradientBySexo(sexoId) }}
                  />
                </div>
              </div>
            );
          }}
          eventClassNames={() => [
            "!bg-transparent !border-none !shadow-none !p-0 !m-0",
          ]}
        />
      </div>
    </div>
  );
}
