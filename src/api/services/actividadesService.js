// src/api/services/actividadesService.js
import axiosClient from "../axiosClient";

// 🆕 Actividades con paginación
// NOTA: El endpoint NO acepta per_page, solo usa page con 15 items por defecto
export const getActividades = (page = 1) => 
  axiosClient.get(`/activities?page=${page}`);

export const getTiposActividades = () => axiosClient.get("/tipos-actividades");

// 🆕 Adultos Mayores con paginación (si no lo tienes ya)
export const getAdultosMayores = (page = 1, perPage = 1000) => 
  axiosClient.get(`/adultoMayor?page=${page}&per_page=${perPage}`);

export const getInscritos = (id) =>
  axiosClient.get(`/activities/${id}/inscritos`);

export const createActividad = (data) => axiosClient.post("/activities", data);

export const updateActividad = (id, data) =>
  axiosClient.put(`/activities/${id}`, data);

export const deleteActividad = (id) => axiosClient.delete(`/activities/${id}`);

export const inscribirAdulto = (actividadId, adultoId) =>
  axiosClient.post(`/activities/${actividadId}/inscritos/${adultoId}`);

export const desinscribirAdulto = (actividadId, adultoId) =>
  axiosClient.delete(`/activities/${actividadId}/inscritos/${adultoId}`);

export const downloadAttendancePDF = (activityId) =>
  axiosClient.get(`/reports/activity/${activityId}/attendance-sheet`, {
    responseType: "blob",
  });

export const downloadInscritosExcel = async (actividadId) => {
  const response = await axiosClient.get(
    `/reports/activity/${actividadId}/excel`,
    { responseType: "blob" }
  );
  return response.data;
};