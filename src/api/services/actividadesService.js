import axiosClient from "../axiosClient";

export const getActividades = () => axiosClient.get("/activities");
export const getTiposActividades = () => axiosClient.get("/tipos-actividades");
export const getAdultosMayores = () => axiosClient.get("/adultoMayor");
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
// ⬇️ Nuevo endpoint para descargar PDF de lista de asistencia
export const downloadAttendancePDF = (activityId) =>
  axiosClient.get(`/reports/activity/${activityId}/attendance-sheet`, {
    responseType: "blob", // importante para archivos binarios
  });
export const downloadInscritosExcel = async (actividadId) => {
  const response = await axiosClient.get(
    `/reports/activity/${actividadId}/excel`,
    { responseType: "blob" } // importante para descargar archivos
  );
  return response.data; // retorna un blob
};
