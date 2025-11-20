// src/components/Sidebar.jsx (versión limpia — sin UserCard)
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

const Logo = () => <div className="text-gray-800 font-bold text-xl">LOGO</div>;

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
        { name: "Usuarios", icon: <Users size={18} />, path: "/users", permission: "view-users" },
        { name: "Roles", icon: <ShieldCheck size={18} />, path: "/roles", permission: "view-roles" },
      ],
    },
    {
      title: "Mantenedores",
      items: [
        { name: "Beneficiarios", icon: <UserPlus size={18} />, path: "/beneficiarios", permission: "view-beneficiarios" },
        { name: "Actividades", icon: <SquareActivity size={18} />, path: "/actividades", permission: "view-actividades" },
        { name: "Asistencias", icon: <CalendarCheck size={18} />, path: "/asistencias", permission: "view-asistencias" },       
      ],
    },
    {
      title: "Calendarios",
      items: [        
        { name: "Calendario Actividades", icon: <CalendarDays size={18} />, path: "/calendario", permission: "view-calendario" },
        { name: "Cumpleaños", icon: <CalendarDays size={18} />, path: "/cumpleaños", permission: "view-cumpleaños" },
      ],
    },
  ];

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-700 text-white shadow-sm"
        : "text-gray-700 hover:bg-slate-100 hover:border-l-4 hover:border-blue-700"
    }`;

  const renderMenu = () => (
    <div className="flex-1 overflow-y-auto px-2 custom-scroll">
      {menuGroups.map((group) => {
        const visibleItems = group.items.filter(
          (item) => !item.permission || hasPermission(item.permission)
        );
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title} className="mb-5">
            <h3 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2.5">
              {group.title}
            </h3>
            {visibleItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkStyles}>
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white text-gray-800 h-screen sticky top-0 border-r border-gray-200">
        <div className="p-5">
          <Logo />
        </div>
        {renderMenu()}
        {/* ✅ UserCard ELIMINADO */}
      </aside>

      {/* Sidebar móvil */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-white text-gray-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:hidden border-r border-gray-200">
            <div className="flex items-center justify-between p-5">
              <Logo />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-gray-500 rounded hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            {renderMenu()}
            {/* ✅ UserCard ELIMINADO */}
          </aside>
        </>
      )}
    </>
  );
}