// src/components/Layout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/beneficiarios":
        return "Beneficiarios";
      case "/actividades":
        return "Actividades";
      case "/profile":
        return "Perfil";
      case "/users":
        return "Usuarios";
      case "/asistencias":
        return "Asistencias";
      case "/roles":
        return "Roles";
      case "/calendario":
        return "Calendario";
      default:
        return "Panel Administrativo";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - se renderiza una sola vez */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white text-black p-4 shadow-md flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{getTitle()}</h1>

          <button
            className="md:hidden p-2 bg-blue-600 rounded text-white hover:bg-blue-800"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Main content - Aquí está el cambio clave */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}