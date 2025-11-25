// src/api/services/adultoMayorService.js
import axiosClient from "../axiosClient";

// 🆕 Adultos Mayores con paginación
export const getAdultosMayores = (page = 1, perPage = 10) =>
  axiosClient.get(`/adultoMayor?page=${page}&per_page=${perPage}`);

export const getAdultoMayor = (id) => axiosClient.get(`/adultoMayor/${id}`);

export const createAdultoMayor = (data) =>
  axiosClient.post("/adultoMayor", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateAdultoMayor = (id, formData) =>
  axiosClient.post(`/adultoMayor/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteAdultoMayor = (id) =>
  axiosClient.delete(`/adultoMayor/${id}`);

// 🎂 Endpoint de cumpleaños (trae TODOS los registros sin paginación)
export const getCumpleanos = (mes = null) => {
  const url = mes
    ? `/adultoMayor/cumpleanos?mes=${mes}`
    : "/adultoMayor/cumpleanos";
  return axiosClient.get(url);
};

// 🪪 Obtener carnet virtual (QR)
export const getCarnetAdultoMayor = (id) =>
  axiosClient.get(`/adultoMayor/${id}/carnet`);

// Catálogos
// 🔹 Sexos
export const getSexos = () => axiosClient.get("/sexos");

// 🔹 Estados Civiles
export const getEstadosCiviles = () => axiosClient.get("/estados-civiles");

// 🔹 Parentescos
export const getParentescos = () => axiosClient.get("/parentescos");

// 🔹 Tipos de Categorías (Programas Sociales)
export const getTiposCategorias = () => axiosClient.get("/tipos-categorias");
