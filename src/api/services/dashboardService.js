// src/api/services/dashboardService.js
import axiosClient from "../axiosClient";

// Obtener estadísticas clave
export const getDashboardStats = async () => {
  const { data } = await axiosClient.get("/dashboard");
  return data;
};

// Listar actividades con conteo de participantes (paginado)
export const getDashboardActivities = async (page = 1) => {
  const { data } = await axiosClient.get("/dashboard/activities", {
    params: { page },
  });
  return data;
};

// Listar usuarios con conteo de actividades inscritas (paginado)
export const getDashboardUsers = async (page = 1) => {
  const { data } = await axiosClient.get("/dashboard/users", {
    params: { page },
  });
  return data;
};
