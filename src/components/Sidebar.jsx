// src/components/Sidebar.jsx
import {
  Home,
  User,
  Users,
  X,
  LogOut,
  ShieldCheck,
  UserPlus,
  SquareActivity,
  CalendarDays,
  CalendarCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logo = () => <div className="text-gray-800 font-bold text-xl">LOGO</div>;

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user, hasPermission, logout } = useAuth();

  const menuGroups = [
    {
      title: "General",
      items: [
        {
          name: "Dashboard",
          icon: <Home size={18} />,
          path: "/dashboard",
          permission: "view-dashboard",
        },
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
        {
          name: "Calendario",
          icon: <CalendarDays size={18} />,
          path: "/calendario",
          permission: "view-calendario",
        },
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
        // Filtrar ítems según permisos
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

  const UserCard = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
      try {
        await logout();
        window.location.href = "/login";
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    };

    const userRole = user?.rol || user?.roles?.[0]?.name || "Usuario";

    return (
      <div className="relative m-4 p-4 mt-auto rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 backdrop-blur-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800">
        {/* Brillo interno suave */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

        <div className="relative flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-300 shadow-md">
            <User size={18} className="text-blue-900 font-bold" />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-white truncate tracking-tight">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-[11px] text-blue-200 truncate font-medium">
              {userRole}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 w-full px-3 py-2 rounded-md bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:from-blue-500 hover:to-blue-400 hover:shadow-lg backdrop-blur-sm border border-blue-400/30"
        >
          <LogOut
            size={14}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
          Cerrar sesión
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white text-gray-800 h-screen sticky top-0 border-r border-gray-200">
        <div className="p-5">
          <Logo />
        </div>
        {renderMenu()}
        <UserCard />
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
            <UserCard />
          </aside>
        </>
      )}
    </>
  );
}
