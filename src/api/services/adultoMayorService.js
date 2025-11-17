// src/api/services/adultoMayorService.js
import axiosClient from "../axiosClient";

// Adultos Mayores
export const getAdultosMayores = () => axiosClient.get("/adultoMayor");
export const getAdultoMayor = (id) => axiosClient.get(`/adultoMayor/${id}`); // ✅ Corregido
export const createAdultoMayor = (data) =>
  axiosClient.post("/adultoMayor", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateAdultoMayor = (id, formData) =>
  axiosClient.post(`/adultoMayor/${id}`, formData, {
    // ✅ Corregido
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteAdultoMayor = (id) =>
  axiosClient.delete(`/adultoMayor/${id}`); // ✅ Corregido

// Catálogos
export const getSexos = () => axiosClient.get("/sexos");
export const getEstadosCiviles = () => axiosClient.get("/estados-civiles");
export const getParentescos = () => axiosClient.get("/parentescos");
