import axiosClient from "../axiosClient";

export const login = async (email, password) => {
  try {
    const response = await axiosClient.post("/login", { email, password });
    return response.data; // contiene access_token, user, etc.
  } catch (error) {
    if (error.response?.status === 422) {
      throw new Error("Credenciales incorrectas");
    } else {
      throw new Error("Error al iniciar sesión");
    }
  }
};

// Función logout
export const logout = async () => {
  try {
    const response = await axiosClient.post("/logout");
    return response.data; // { message: "Sesión cerrada exitosamente" }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al cerrar sesión");
  }
};
