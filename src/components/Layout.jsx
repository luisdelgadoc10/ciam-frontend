import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Menu,
  LogOut,
  KeyRound,
  Home,
  UserPlus,
  SquareActivity,
  Users,
  ShieldCheck,
  CalendarCheck,
  CalendarDays,
  Cake,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/beneficiarios":
        return "Beneficiarios";
      case "/actividades":
        return "Actividades";
      case "/users":
        return "Usuarios";
      case "/roles":
        return "Roles";
      case "/asistencias":
        return "Asistencias";
      case "/profile":
        return "Mi Perfil";
      case "/calendario":
        return "Calendario";
      case "/cumpleanos":
        return "Cumpleaños";
      default:
        return "Panel Administrativo";
    }
  };

  const getIcon = () => {
    const path = location.pathname;

    const icons = {
      "/dashboard": <Home size={18} />,
      "/beneficiarios": <UserPlus size={18} />,
      "/actividades": <SquareActivity size={18} />,
      "/users": <Users size={18} />,
      "/roles": <ShieldCheck size={18} />,
      "/asistencias": <CalendarCheck size={18} />,
      "/calendario": <CalendarDays size={18} />,
      "/cumpleanos": <Cake size={18} />,
    };

    return icons[path] || <Home size={18} />;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const initials = `${user?.nombre?.charAt(0) || "?"}${
    user?.apellido?.charAt(0) || "?"
  }`.toUpperCase();

  const userRole = user?.rol || user?.roles?.[0]?.name || "Usuario";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER CORPORATIVO */}
        <header className="h-16 bg-white border-b border-gray-300 shadow-sm px-6 flex items-center justify-between">
          {/* TITULO */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 text-white rounded-md shadow-sm">
              {getIcon()}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {getTitle()}
              </span>
              <span className="text-xs text-gray-500 -mt-0.5">
                Panel administrativo
              </span>
            </div>
          </div>

          {/* PERFIL + MENU */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-md transition-all shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>

                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user?.nombre}
                </span>
              </button>

              {/* DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-300 shadow-lg z-50">
                  {/* TOP usuario */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>

                  {/* Perfil */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-blue-50 transition-colors"
                  >
                    <KeyRound size={16} />
                    Mi Perfil
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* BOTÓN ABRIR SIDEBAR EN MÓVIL */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
