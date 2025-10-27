import React from "react";
import { X, Save } from "lucide-react";
import Checkbox from "../../../components/ui/Checkbox"; // ✅ Importamos tu checkbox
import Portal from "../../../components/Portal";

export default function ModalUsuario({
  show,
  onClose,
  modo = "crear", // "crear" | "editar" | "ver"
  formData = {}, // ← se usa directamente, como en tu page
  roles = [], // lista de roles disponibles
  onChange,
  onRoleChange,
  onSubmit,
  loading = false,
}) {
  if (!show) return null;

  // IDs de roles seleccionados
  const selectedRoleIds =
    formData.roles?.map((r) => (typeof r === "object" ? r.id : r)) || [];

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {modo === "ver"
                ? `Usuario: ${formData?.nombre || ""} ${
                    formData?.apellido || ""
                  }`
                : modo === "editar"
                ? `Editar Usuario: ${formData?.nombre || ""}`
                : "Crear Usuario"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MODO VER */}
          {modo === "ver" ? (
            <div className="p-6 space-y-3">
              <p>
                <strong>Nombre:</strong> {formData?.nombre || "-"}
              </p>
              <p>
                <strong>Apellido:</strong> {formData?.apellido || "-"}
              </p>
              <p>
                <strong>Correo:</strong> {formData?.email || "-"}
              </p>
              <p>
                <strong>Roles:</strong>{" "}
                {formData?.roles?.length
                  ? formData.roles
                      .map((r) => (typeof r === "object" ? r.name : ""))
                      .join(", ")
                  : "Sin roles"}
              </p>
            </div>
          ) : (
            // MODO CREAR / EDITAR
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {/* NOMBRE */}
              <div>
                <label className="block text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData?.nombre || ""}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* APELLIDO */}
              <div>
                <label className="block text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData?.apellido || ""}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* USUARIO */}
              <div>
                <label className="block text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  name="usuario"
                  value={formData?.usuario || ""}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              {/* FECHA DE NACIMIENTO */}
              <div>
                <label className="block text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fecha_de_nacimiento"
                  value={formData?.fecha_de_nacimiento || ""}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* PASSWORD SOLO EN CREAR */}
              {modo === "crear" && (
                <div>
                  <label className="block text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData?.password || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              )}
              {/* PASSWORD CONFIRMATION (solo crear o si se está cambiando) */}
              {modo === "crear" && (
                <div>
                  <label className="block text-gray-700 mb-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData?.password_confirmation || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              )}

              {/* ROLES */}
              <div>
                <label className="block text-gray-700 mb-2">Roles</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <Checkbox
                      key={role.id}
                      id={`role-${role.id}`}
                      name="roles"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={(e) => onRoleChange(role.id, e.target.checked)}
                      label={role.name}
                    />
                  ))}
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition"
                  disabled={loading}
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
}
