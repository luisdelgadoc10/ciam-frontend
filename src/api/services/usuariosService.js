// src/api/services/usuariosService.js
import axiosClient from "../axiosClient";

export const getUsuarios = async () => {
  const { data } = await axiosClient.get("/users");
  return data.data || data;
};

export const createUsuario = async (usuario) => {
  const { data } = await axiosClient.post("/users", usuario);
  return data;
};

export const updateUsuario = async (id, usuario) => {
  const { data } = await axiosClient.put(`/users/${id}`, usuario);
  return data;
};

export const deleteUsuario = async (id) => {
  const { data } = await axiosClient.delete(`/users/${id}`);
  return data;
};

export const resetPassword = async (id) => {
  const { data } = await axiosClient.post(`/users/${id}/reset-password`);
  return data;
};

export const assignRoles = async (id, roles) => {
  const { data } = await axiosClient.post(`/users/${id}/assign-roles`, {
    roles,
  });
  return data;
};


