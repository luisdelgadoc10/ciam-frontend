import {
  Home,
  Users,
  ShieldCheck,
  UserPlus,
  SquareActivity,
  CalendarCheck,
  CalendarDays,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logo = () => (
  <div className="text-blue-800 font-extrabold text-xl tracking-tight">
    LOGO
  </div>
);

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { hasPermission } = useAuth();

  const menuGroups = [
    {
      title: "General",
      items: [
        { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
      ],
    },
    {
      title: "Acceso",
      items: [
        {
          name: "Usuarios",
          icon: <Users size={18} />,
          path: "/users",
          permission: "view-users",
        },
        {
          name: "Roles",
          icon: <ShieldCheck size={18} />,
          path: "/roles",
          permission: "view-roles",
        },
      ],
    },
    {
      title: "Mantenedores",
      items: [
        {
          name: "Beneficiarios",
          icon: <UserPlus size={18} />,
          path: "/beneficiarios",
          permission: "view-beneficiarios",
        },
        {
          name: "Actividades",
          icon: <SquareActivity size={18} />,
          path: "/actividades",
          permission: "view-actividades",
        },
        {
          name: "Asistencias",
          icon: <CalendarCheck size={18} />,
          path: "/asistencias",
          permission: "view-asistencias",
        },
      ],
    },
    {
      title: "Calendarios",
      items: [
        {
          name: "Calendario Actividades",
          icon: <CalendarDays size={18} />,
          path: "/calendario",
          permission: "view-calendario",
        },
        {
          name: "Cumpleaños",
          icon: <CalendarDays size={18} />,
          path: "/cumpleanos",
          permission: "view-cumpleaños",
        },
      ],
    },
  ];

  // Estilo corporativo
  const linkStyles = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-2.5 rounded-md text-sm 
    font-medium transition-all duration-150 border 
    ${
      isActive
        ? "bg-blue-700 border-blue-800 text-white shadow-sm"
        : "bg-white border-transparent text-gray-800 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800"
    }
  `;

  const renderMenu = () => (
    <div className="flex-1 overflow-y-auto px-4 py-3 custom-scroll">
      {menuGroups.map((group) => {
        const visibleItems = group.items.filter(
          (item) => !item.permission || hasPermission(item.permission)
        );
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title} className="mb-6">
            <h3 className="text-[12px] uppercase text-gray-600 font-bold mb-2 tracking-wider">
              {group.title}
            </h3>

            <div className="flex flex-col gap-2">
              {visibleItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={linkStyles}>
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* separador enterprise */}
            <div className="border-b border-gray-300 mt-4"></div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="
        hidden md:flex md:flex-col md:w-64 h-screen sticky top-0 
        bg-white text-gray-800 border-r border-gray-300 shadow-sm
      "
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-300 bg-gray-50">
          <Logo />
        </div>
        {renderMenu()}
      </aside>

      {/* Mobile */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />

          <aside
            className="
              fixed top-0 left-0 h-full w-64 bg-white text-gray-800 
              flex flex-col z-50 transition-transform duration-300 ease-in-out md:hidden 
              border-r border-gray-300 shadow-lg
            "
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-300 bg-gray-50">
              <Logo />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-gray-600 rounded hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {renderMenu()}
          </aside>
        </>
      )}
    </>
  );
}
