// src/api/services/adultoMayorService.js
import axiosClient from "../axiosClient";

// Adultos Mayores
export const getAdultosMayores = () => axiosClient.get("/adultoMayor");
export const getAdultoMayor = (id) => axiosClient.get(`/adultoMayor/${id}`);
export const createAdultoMayor = (data) => axiosClient.post("/adultoMayor", data);
export const updateAdultoMayor = (id, data) => axiosClient.put(`/adultoMayor/${id}`, data);
export const deleteAdultoMayor = (id) => axiosClient.delete(`/adultoMayor/${id}`);

// Catálogos
export const getSexos = () => axiosClient.get("/sexos");
export const getEstadosCiviles = () => axiosClient.get("/estados-civiles");
export const getParentescos = () => axiosClient.get("/parentescos");