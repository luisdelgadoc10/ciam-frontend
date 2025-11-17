// src/api/services/dashboardService.js
import axiosClient from "../axiosClient";

// Obtener estadísticas clave
export const getDashboardStats = async () => {
  const { data } = await axiosClient.get("/dashboard");
  return data;
};
