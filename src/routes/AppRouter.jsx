// routes/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/Auth/LoginPage";
import Dashboard from "../pages/Dashboard/DashboardPage";
import AdultoMayorPage from "../pages/Beneficiarios/AdultoMayorPage";
import ActividadesPage from "../pages/Actividades/ActividadesPage";
import RolesPage from "../pages/Roles/RolesPage";
import UsuariosPage from "../pages/Usuarios/UsuariosPage";
import AsistenciasPage from "../pages/Asistencias/AttendancesPage";
import ActividadesCalendarioPage from "../pages/Actividades/ActividadesCalendarioPage";
// ...otras páginas

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas - envueltas en Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="beneficiarios" element={<AdultoMayorPage />} />
          <Route path="actividades" element={<ActividadesPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="users" element={<UsuariosPage />} />
          <Route path="asistencias" element={<AsistenciasPage />} />
          <Route path="calendario" element={<ActividadesCalendarioPage />} />
          {/* Otras páginas */}
        </Route>

        {/* Ruta fallback 404 */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
