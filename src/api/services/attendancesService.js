// src/api/services/attendancesService.js
import axiosClient from "../axiosClient";

// Crear asistencia
export const createAttendance = (data) => axiosClient.post("/attendances", data);

// Actualizar asistencia
export const updateAttendance = (id, data) => axiosClient.put(`/attendances/${id}`, data);

// Eliminar asistencia
export const deleteAttendance = (id) => axiosClient.delete(`/attendances/${id}`);

// Listar asistencias por actividad
export const getAttendancesByActivity = (activityId) => {
  const url = `/activities/${activityId}/attendances`;
  console.log('🔵 [GET] Llamando a:', url);
  return axiosClient.get(url);
};

// Listar historial de asistencias de un adulto mayor
export const getAttendancesByAdultoMayor = (adultoId) => {
  const url = `/adultos-mayores/${adultoId}/attendances`;
  console.log('🔵 [GET] Llamando a:', url);
  return axiosClient.get(url);
};