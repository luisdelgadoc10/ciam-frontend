// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// Interceptor para incluir token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // ❗ Quita Content-Type en métodos GET
  if (config.method === "get") {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Interceptor de respuesta para manejar expiración de token
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axiosClient.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
