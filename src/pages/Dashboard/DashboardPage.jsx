import { Users, Activity } from "lucide-react";
import useDashboardLocal from "../../hooks/useDashboardLocal";

export default function Dashboard() {
  const { stats, activities, users, loading } = useDashboardLocal();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200"></div>
          <div className="absolute top-0 w-12 h-12 rounded-full border-4 border-blue-600 animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Usuarios",
      value: stats.total_users,
      icon: <Users className="w-10 h-10" />,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      title: "Actividades",
      value: stats.total_activities,
      icon: <Activity className="w-10 h-10" />,
      gradient: "from-green-400 via-teal-400 to-cyan-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Contadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`relative rounded-2xl p-6 flex flex-col justify-between shadow-lg text-white bg-gradient-to-r ${c.gradient} transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium opacity-90">{c.title}</p>
                <p className="text-3xl font-bold mt-1">{c.value}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actividades y Usuarios lado a lado en pantallas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividades */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-800">Últimas Actividades</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {activities.slice(0, 5).map((a) => (
              <li
                key={a.id}
                className="px-6 py-4 hover:bg-green-50/50 transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">{a.nombre}</div>
              </li>
            ))}
            {activities.length === 0 && (
              <li className="px-6 py-4 text-gray-500 italic">No hay actividades recientes</li>
            )}
          </ul>
        </div>

        {/* Usuarios */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-800">Usuarios recientes</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {users.slice(0, 5).map((u) => (
              <li
                key={u.id}
                className="px-6 py-4 hover:bg-indigo-50/50 transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">{u.nombre} {u.apellido}</div>
              </li>
            ))}
            {users.length === 0 && (
              <li className="px-6 py-4 text-gray-500 italic">No hay usuarios recientes</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
