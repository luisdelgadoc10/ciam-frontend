// src/pages/Cumpleanos/components/Calendario.jsx
import { useMemo } from "react";
import { Cake, User, ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendario({
  adultosMayores,
  currentYear,
  currentMonth,
  setCurrentYear,
  setCurrentMonth,
}) {
  const today = new Date();

  const eventosPorDia = useMemo(() => {
    const eventos = {};
    adultosMayores.forEach((adulto) => {
      if (!adulto.fecha_nacimiento) return;
      const [birthYear, birthMonth, birthDay] = adulto.fecha_nacimiento
        .split("-")
        .map(Number);
      if (birthYear && birthMonth && birthDay) {
        const date = new Date(currentYear, birthMonth - 1, birthDay);
        const key = date.toDateString();
        if (!eventos[key]) eventos[key] = [];
        eventos[key].push(adulto);
      }
    });
    return eventos;
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

  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const generarDiasMes = () => {
    const primerDia = new Date(currentYear, currentMonth, 1);
    const ultimoDia = new Date(currentYear, currentMonth + 1, 0);
    const dias = [];

    let startDay = primerDia.getDay(); // 0=domingo
    startDay = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < startDay; i++) dias.push(null);

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(currentYear, currentMonth, d));
    }

    return dias;
  };

  const diasMes = generarDiasMes();

  const cambiarMes = (offset) => {
    const nuevoMes = currentMonth + offset;
    if (nuevoMes < 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else if (nuevoMes > 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(nuevoMes);
    }
  };

  return (
    <div>
      {/* Controles de mes */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border-2 border-gray-300 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => cambiarMes(-1)} className="p-2 rounded-full hover:bg-gray-100 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setCurrentYear(today.getFullYear());
              setCurrentMonth(today.getMonth());
            }}
            className="p-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Hoy
          </button>
        </div>

        <h2 className="font-semibold text-lg">
          {new Date(currentYear, currentMonth).toLocaleString("es-ES", { month: "long", year: "numeric" })}
        </h2>

        <button onClick={() => cambiarMes(1)} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Calendario */}
      <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-gray-300 grid grid-cols-7 gap-2">
        {diasSemana.map((d) => (
          <div key={d} className="font-bold text-center text-gray-800 text-sm py-1 border-b-2 border-gray-800">
            {d}
          </div>
        ))}

        {diasMes.map((fecha, idx) => {
          if (!fecha) return <div key={idx} className="p-2"></div>;

          const key = fecha.toDateString();
          const eventos = eventosPorDia[key] || [];

          return (
            <div key={idx} className="border-2 border-gray-300 rounded-lg p-1 min-h-[80px] relative hover:shadow-md transition">
              <div className="text-sm font-medium mb-1">{fecha.getDate()}</div>
              <div className="flex flex-wrap gap-1">
                {eventos.map((adulto) => {
                  const [birthYear, birthMonth, birthDay] = adulto.fecha_nacimiento.split("-").map(Number);
                  const edad = currentYear - birthYear;
                  const sexoId = adulto.sexo?.id || 0;
                  const hasPhoto = adulto.foto_url || adulto.foto || adulto.imagen || adulto.imagen_url;

                  return (
                    <div key={adulto.id} className="relative group inline-flex items-center">
                      <div
                        tabIndex={0}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          document.documentElement.style.setProperty("--tooltip-x", `${rect.left + rect.width / 2}px`);
                          document.documentElement.style.setProperty("--tooltip-y", `${rect.top}px`);
                        }}
                        className="w-14 h-14 rounded-full overflow-hidden shadow-md cursor-pointer flex items-center justify-center bg-gray-200"
                        style={{ border: getBorderBySexo(sexoId) }}
                      >
                        {hasPhoto ? (
                          <img src={adulto.foto_url || adulto.foto || adulto.imagen || adulto.imagen_url} alt={`${adulto.nombres} ${adulto.apellidos}`} className="w-full h-full object-cover" />
                        ) : (
                          <User className={`w-8 h-8 ${sexoId === 1 ? "text-blue-600" : sexoId === 2 ? "text-pink-500" : "text-gray-500"}`} />
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
                        <div className="px-4 py-3 rounded-xl backdrop-blur-[8px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] border border-white/20 text-white w-max max-w-[260px] flex items-center gap-3 transition-all duration-300 group-hover:scale-105 group-focus:scale-105 group-hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.5)]"
                             style={{ background: getGradientBySexo(sexoId) }}
                        >
                          <div className="relative flex-shrink-0">
                            {hasPhoto ? (
                              <img src={adulto.foto_url || adulto.foto || adulto.imagen || adulto.imagen_url} alt={`${adulto.nombres} ${adulto.apellidos}`} className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-inner ring-2 ring-white/30" style={{ border: getBorderBySexo(sexoId) }} />
                            ) : (
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/30 shadow-inner ring-2 ring-white/30 ${sexoId === 1 ? "bg-blue-200" : sexoId === 2 ? "bg-pink-200" : "bg-gray-300"}`}>
                                <User className={`w-6 h-6 ${sexoId === 1 ? "text-blue-600" : sexoId === 2 ? "text-pink-500" : "text-gray-500"}`} />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs text-white font-bold shadow-md ring-2 ring-white">
                              <Cake className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="flex flex-col leading-tight min-w-0">
                            <span className="font-semibold text-sm truncate">{adulto.nombres} {adulto.apellidos}</span>
                            <span className="text-xs font-medium flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse mr-1"></span>
                              Cumple {edad} años
                            </span>
                            <span className="text-[11px] mt-0.5 text-white/80">{`${birthDay} de ${new Date(currentYear, birthMonth - 1, birthDay).toLocaleString("es-ES", { month: "long" })} de ${currentYear}`}</span>
                          </div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 mt-1" style={{ background: getGradientBySexo(sexoId) }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
