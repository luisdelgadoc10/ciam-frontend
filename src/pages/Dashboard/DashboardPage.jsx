import { Users, Activity } from "lucide-react";
import useDashboardLocal from "../../hooks/useDashboardLocal";

// Componente de tarjeta de escuela
function SchoolCard({ title, description, image, gradient, icon, badgeColor }) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br ${gradient} text-white p-6 h-full flex flex-col transition-transform duration-300 hover:scale-[1.02]`}
    >
      {/* Imagen */}
      <div className="relative mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover rounded-xl"
        />
        {/* Anillo decorativo */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
          <div className={`w-3/4 h-1/2 rounded-full border-4 ${badgeColor} opacity-30`}></div>
        </div>
      </div>

      {/* Badge "Escuela de" */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${badgeColor} mb-3`}>
        <span>🎓 Escuela de</span>
      </div>

      {/* Título y descripción */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90 leading-relaxed flex-grow">{description}</p>

      {/* Icono en esquina superior derecha */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
        {icon}
      </div>
    </div>
  );
}

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

  // Cards de estadísticas
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

  // Datos de las escuelas
  const schools = [
    {
      id: 1,
      title: "PROGRAMACIÓN Y DESARROLLO WEB",
      description: "Aprende programación y desarrollo web desde cero con las tecnologías más demandadas del mercado.",
      image: "https://via.placeholder.com/300x400?text=Programaci%C3%B3n+Web",
      gradient: "from-blue-600 to-blue-800",
      icon: "💻",
      badgeColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "DESARROLLO FRONTEND",
      description: "Domina el desarrollo frontend y crea interfaces web atractivas y funcionales con React, Tailwind y más.",
      image: "https://via.placeholder.com/300x400?text=Frontend",
      gradient: "from-green-600 to-green-800",
      icon: "🎨",
      badgeColor: "bg-green-500",
    },
    {
      id: 3,
      title: "DESARROLLO BACKEND",
      description: "Domina el desarrollo backend en esta escuela especializada que te prepara con Node.js, bases de datos y APIs.",
      image: "https://via.placeholder.com/300x400?text=Backend",
      gradient: "from-red-600 to-red-800",
      icon: "⚙️",
      badgeColor: "bg-red-500",
    },
    {
      id: 4,
      title: "INTELIGENCIA ARTIFICIAL",
      description: "Conviértete en experto en inteligencia artificial en nuestra escuela con enfoque práctico y proyectos reales.",
      image: "https://via.placeholder.com/300x400?text=IA",
      gradient: "from-yellow-600 to-yellow-800",
      icon: "🤖",
      badgeColor: "bg-yellow-500",
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

      {/* Actividades y Usuarios */}
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

      {/* Cards de Escuelas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {schools.map((school) => (
          <SchoolCard
            key={school.id}
            title={school.title}
            description={school.description}
            image={school.image}
            gradient={school.gradient}
            icon={school.icon}
            badgeColor={school.badgeColor}
          />
        ))}
      </div>
    </div>
  );
}