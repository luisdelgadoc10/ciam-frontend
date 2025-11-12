// src/components/Layout.jsx
import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/beneficiarios": return "Beneficiarios";
      case "/actividades": return "Actividades";
      case "/profile": return "Perfil";
      case "/users": return "Usuarios";
      case "/asistencias": return "Asistencias";
      case "/roles": return "Roles";
      case "/calendario": return "Calendario";
      default: return "Panel Administrativo";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      window.location.href = "/login";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const userRole = user?.rol || user?.roles?.[0]?.name || "Usuario";
  const initials = `${user?.nombre?.charAt(0) || "?"}${user?.apellido?.charAt(0) || "?"}`.toUpperCase();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 bg-white text-black p-4 shadow-md flex items-center justify-between">
          <h1 className="text-2xl font-semibold truncate max-w-[60vw]">{getTitle()}</h1>

          {/* ✅ Dropdown de perfil (desktop + móvil) */}
          <div className="flex items-center gap-2">
            {/* ✅ PRIMERO: Botón de perfil (responsive) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                aria-label="Menú de usuario"
              >
                <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {initials}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user?.nombre}
                </span>
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                    role="menuitem"
                  >
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>

            {/* ✅ SEGUNDO: Botón de menú sidebar (solo en móvil) */}
            <button
              className="md:hidden p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}