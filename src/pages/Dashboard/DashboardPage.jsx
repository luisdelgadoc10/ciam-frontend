import {
  Users,
  Activity,
  Cake,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  UserRound,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
  Legend,
} from "recharts";
import useDashboard from "../../hooks/useDashboard";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const { kpis, proximosCumpleanos, graficos, loading } = useDashboard();

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-4 border-blue-300 border-t-blue-700 animate-spin mx-auto mb-3"></div>
          <p className="text-gray-700 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-10">
      {/* HEADER — Igual que UsuariosPage */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard General
          </h1>
          <p className="text-gray-600">Resumen del sistema y estadísticas</p>
        </div>
      </div>

      {/* ================= KPIS ================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <KpiCard
            title="Adultos Mayores"
            value={kpis.total_adultos_mayores}
            icon={<Users />}
          />
          <KpiCard
            title="Activos"
            value={kpis.adultos_activos}
            icon={<Activity />}
          />
          <KpiCard
            title="Fallecidos"
            value={kpis.adultos_fallecidos}
            icon={<Users />}
            gray
          />
          <KpiCard
            title="Asistencia Hoy"
            value={kpis.asistencia_hoy}
            icon={<Users />}
          />
          <KpiCard
            title="Actividades Activas"
            value={kpis.actividades_activas}
            icon={<Activity />}
          />
        </div>
      </section>

      {/* ================= CUMPLEAÑOS ================= */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Cake className="text-blue-500" /> Próximos Cumpleaños
        </h2>

        {proximosCumpleanos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow">
            <Cake className="mx-auto w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">
              No hay cumpleaños en los próximos 7 días.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proximosCumpleanos.map((item) => {
              const fecha = new Date(item.dia_cumpleanos);
              const dia = String(fecha.getDate()).padStart(2, "0");
              const mes = fecha
                .toLocaleString("es-ES", { month: "short" })
                .replace(".", "");
              const fechaCorta = `${dia} ${mes
                .charAt(0)
                .toUpperCase()}${mes.slice(1)}`;

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex"
                >
                  {/* FOTO */}
                  <div className="w-36 h-full overflow-hidden">
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={item.nombre_completo}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="h-full flex items-center flex-col justify-center text-gray-400">
                        <UserRound className="w-12 h-12 opacity-60" />
                        <p className="text-xs mt-1">Sin foto</p>
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition">
                      {item.nombre_completo}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold shadow-sm border border-blue-200">
                        {fechaCorta}
                      </div>
                      <Cake className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Cumple{" "}
                      <span className="font-semibold">
                        {item.edad_a_cumplir}
                      </span>{" "}
                      años
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= GRÁFICOS ================= */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Análisis Visual
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* SEXO */}
          <ChartCard title="Distribución por Sexo" icon={<BarChart3 />}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={graficos.distribucion_sexo}>
                <XAxis dataKey="nombre" tick={{ fill: "#6B7280" }} />
                <YAxis tick={{ fill: "#6B7280" }} />
                <RechartsTooltip />
                <Bar
                  dataKey="total"
                  fill="url(#blueGrad)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#A5B4FC" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* RANGOS */}
          <ChartCard title="Rangos de Edad" icon={<PieIcon />}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={graficos.rangos_edad}
                  dataKey="total"
                  nameKey="rango_edad"
                  cx="50%"
                  cy="45%"
                  innerRadius={35}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {graficos.rangos_edad.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ASISTENCIA */}
          <ChartCard title="Asistencia Semanal" icon={<LineIcon />}>
            {graficos.asistencia_semanal.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-gray-400">
                <LineIcon className="w-10 h-10 opacity-50" />
                <p className="text-sm ml-3">Sin datos esta semana</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={graficos.asistencia_semanal}>
                  <XAxis dataKey="dia" tick={{ fill: "#6B7280" }} />
                  <YAxis tick={{ fill: "#6B7280" }} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#fff",
                      stroke: "#4F46E5",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: "#fff", stroke: "#4F46E5" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTES ================= */
function KpiCard({ title, value, icon, gray }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value?.toLocaleString() || 0}
          </p>
        </div>

        <div
          className={`p-3 rounded-xl ${
            gray
              ? "bg-gray-100 text-gray-500"
              : "bg-gradient-to-br from-blue-600 to-blue-400 text-white"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
