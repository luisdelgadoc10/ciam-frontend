import axiosClient from "../axiosClient";

// Roles
export const getRoles = () => axiosClient.get("/roles");
export const getRole = (id) => axiosClient.get(`/roles/${id}`);
export const createRole = (data) => axiosClient.post("/roles", data);
export const updateRole = (id, data) => axiosClient.put(`/roles/${id}`, data);
export const deleteRole = (id) => axiosClient.delete(`/roles/${id}`);

// Permisos
export const getPermissions = () => axiosClient.get("/permissions");
export const assignPermissions = (roleId, data) =>
  axiosClient.post(`/roles/${roleId}/assign-permissions`, data);
