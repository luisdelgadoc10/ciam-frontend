// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login, logout } from "../api/services/authService";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Para mostrar un loader inicial

  //  Verificar sesión al montar el componente
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        // Configurar token en axios
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;

        try {
          // Verificar que el token siga válido con /api/me
          const response = await axiosClient.get("/me");

          setToken(storedToken);
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.error("Token inválido o expirado:", error);
          // Limpiar todo si el token no es válido
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axiosClient.defaults.headers.common["Authorization"];
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  //  Login
  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password);

      const accessToken = data?.access_token;
      const userData = data?.user;

      if (!userData || !accessToken) {
        throw new Error("Respuesta de login incompleta");
      }

      // Configurar token en axios
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      // Guardar en estado y localStorage
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login fallido:", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    } finally {
      // Limpiar todo
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axiosClient.defaults.headers.common["Authorization"];
    }
  };

  //  Verificar permisos (usando los roles del /api/me)
  const hasPermission = (permissionName) => {
    if (!user?.roles) return false;

    return user.roles.some((role) =>
      role.permissions?.some((permission) => permission.name === permissionName)
    );
  };

  // Mostrar un loader mientras se verifica la sesión
  if (loading) {
    return <div>Cargando...</div>; // O tu componente de loading
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: loginUser,
        logout: logoutUser,
        hasPermission,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
