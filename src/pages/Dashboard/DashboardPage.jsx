import {
  Users,
  Activity,
  Cake,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
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

// Paleta azul moderna (Tailwind + ajustes suaves)
const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"]; // azul-800 → azul-200

export default function Dashboard() {
  const { kpis, proximosCumpleanos, graficos, loading } = useDashboard();

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-700 animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* KPIS — Modernizado */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Estadísticas Generales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Adultos Mayores"
            value={kpis.total_adultos_mayores}
            icon={<Users className="w-6 h-6 text-blue-700" />}
            color="blue"
          />
          <KpiCard
            title="Activos"
            value={kpis.adultos_activos}
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            color="blue"
          />
          <KpiCard
            title="Fallecidos"
            value={kpis.adultos_fallecidos}
            icon={<Users className="w-6 h-6 text-gray-500" />}
            color="gray"
          />
          <KpiCard
            title="Asistencia Hoy"
            value={kpis.asistencia_hoy}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="blue"
          />
          <KpiCard
            title="Actividades Activas"
            value={kpis.actividades_activas}
            icon={<Activity className="w-6 h-6 text-blue-700" />}
            color="blue"
          />
        </div>
      </section>

      {/* CUMPLEAÑOS — Horizontal, foto carnet + grid responsivo */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Cake className="text-blue-500" />
          Próximos Cumpleaños
        </h2>

        {proximosCumpleanos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 py-12 text-center">
            <Cake className="mx-auto w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500">
              No hay cumpleaños en los próximos 7 días.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {proximosCumpleanos.map((item) => {
              // Formatear fecha a "DD MMM" (ej: "18 Nov")
              const fecha = new Date(item.dia_cumpleanos);
              const dia = String(fecha.getDate()).padStart(2, "0");
              const mes = fecha
                .toLocaleString("es-ES", { month: "short" })
                .replace(".", "");
              const fechaCorta = `${dia} ${
                mes.charAt(0).toUpperCase() + mes.slice(1)
              }`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
                >
                  {/* Foto carnet arriba */}
                  <div className="h-48 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                    <div className="w-36 h-48 flex items-center justify-center">
                      {item.foto ? (
                        <img
                          src={item.foto}
                          alt={item.nombre_completo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center px-2">
                          <UserRound className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">Sin foto</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datos debajo */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 leading-tight mb-2">
                      {item.nombre_completo}
                    </h3>

                    {/* ——— FECHA RESALTADA ——— */}
                    <div className="flex items-center gap-2 mb-2">
                      <Cake className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-lg font-bold text-blue-700">
                        {fechaCorta}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      Cumple{" "}
                      <span className="font-medium">{item.edad_a_cumplir}</span>{" "}
                      años
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* GRÁFICOS — Diseño premium */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Análisis Visual
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distribución por Sexo */}
          <ChartCard
            title="Distribución por Sexo"
            icon={<BarChart3 className="text-blue-700" />}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={graficos.distribucion_sexo}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="nombre"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    backgroundColor: "white",
                    fontSize: "0.875rem",
                    padding: "0.75rem",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="url(#blueGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Rangos de Edad */}
          <ChartCard
            title="Rangos de Edad"
            icon={<PieIcon className="text-blue-700" />}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={graficos.rangos_edad}
                  dataKey="total"
                  nameKey="rango_edad"
                  cx="50%"
                  cy="45%"
                  outerRadius={70}
                  innerRadius={35}
                  paddingAngle={2}
                >
                  {graficos.rangos_edad.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) => [`${value} adultos`, "Cantidad"]}
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    backgroundColor: "white",
                    fontSize: "0.875rem",
                    padding: "0.75rem",
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                  wrapperStyle={{ paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Asistencia Semanal */}
          <ChartCard
            title="Asistencia Semanal"
            icon={<LineIcon className="text-blue-700" />}
          >
            {graficos.asistencia_semanal.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-gray-400">
                <LineIcon className="w-10 h-10 opacity-50 mb-2" />
                <span className="text-sm">Sin datos esta semana</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={graficos.asistencia_semanal}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="dia"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#4B5563" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      padding: "0.75rem",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#818CF8"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    strokeOpacity={1}
                    dot={{
                      r: 4,
                      stroke: "#4F46E5",
                      strokeWidth: 2,
                      fill: "white",
                      fillOpacity: 1,
                    }}
                    activeDot={{
                      r: 6,
                      stroke: "#4338CA",
                      strokeWidth: 2,
                      fill: "#FFFFFF",
                    }}
                    fill="url(#lineGradient)"
                    fillOpacity={0.3}
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

// ========== COMPONENTES MEJORADOS ==========
function KpiCard({ title, value, icon, color }) {
  const bgColor = color === "blue" ? "bg-blue-50" : "bg-gray-50";
  const iconColor = color === "blue" ? "text-blue-700" : "text-gray-500";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {typeof value === "number" ? value.toLocaleString() : value ?? 0}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor} ${iconColor} flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md duration-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-blue-700">{icon}</span>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
