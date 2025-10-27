import React from "react";
import Portal from "../../../components/Portal";


export default function ModalRol({
  show,
  onClose,
  modo = "crear",
  formData,
  permissions = [],
  onChange,
  onPermissionChange, // ← nuevo prop
  onSubmit,
  loading = false,
}) {
  if (!show) return null;

  const selectedPermissionIds = formData?.permissions || [];

  return (
    <Portal>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {modo === "ver"
              ? `Rol: ${formData?.name ?? ""}`
              : modo === "editar"
              ? `Editar Rol: ${formData?.name ?? ""}`
              : "Crear Rol"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {modo === "ver" ? (
          <div className="p-6 space-y-3">
            <p>
              <strong>Nombre:</strong> {formData?.name || "-"}
            </p>
            <p>
              <strong>Permisos:</strong>{" "}
              {formData?.permissions?.length
                ? formData.permissions.map((p) => p.name).join(", ")
                : "-"}
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Permisos</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {permissions.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissionIds.includes(p.id)}
                      onChange={(e) =>
                        onPermissionChange(p.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

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
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition"
                disabled={loading}
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </Portal>
  );
}