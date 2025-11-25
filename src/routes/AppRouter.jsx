// routes/AppRouter.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/Auth/LoginPage";
import Dashboard from "../pages/Dashboard/DashboardPage";
import AdultoMayorPage from "../pages/Beneficiarios/AdultoMayorPage";
import ActividadesPage from "../pages/Actividades/ActividadesPage";
import RolesPage from "../pages/Roles/RolesPage";
import UsuariosPage from "../pages/Usuarios/UsuariosPage";
import AsistenciasPage from "../pages/Asistencias/AttendancesPage";
import ActividadesCalendarioPage from "../pages/Actividades/ActividadesCalendarioPage";
import CumpleanosCalendarioPage from "../pages/Cumpleaños/CumpleanosCalendarioPage";

import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/Profile/ProfilePage";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas - envueltas en Layout */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="beneficiarios"
            element={
              <PrivateRoute>
                <AdultoMayorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="actividades"
            element={
              <PrivateRoute>
                <ActividadesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="roles"
            element={
              <PrivateRoute>
                <RolesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute>
                <UsuariosPage />
              </PrivateRoute>
            }
          />
          <Route
            path="asistencias"
            element={
              <PrivateRoute>
                <AsistenciasPage />
              </PrivateRoute>
            }
          />
          <Route
            path="calendario"
            element={
              <PrivateRoute>
                <ActividadesCalendarioPage />
              </PrivateRoute>
            }
          />
          <Route
            path="cumpleanos"
            element={
              <PrivateRoute>
                <CumpleanosCalendarioPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Ruta fallback 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
