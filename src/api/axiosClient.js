// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para incluir token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuesta para manejar expiración de token
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar token y usuario
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axiosClient.defaults.headers.common['Authorization'];

      // Redirigir al login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
