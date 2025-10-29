import React from "react";
import { Save, Shield, CheckSquare } from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import InputField from "../../../components/ui/InputField";
import DataItem from "../../../components/ui/DataItem";

export default function ModalRol({
  show,
  onClose,
  modo = "crear",
  formData = {},
  permissions = [],
  onChange,
  onPermissionChange,
  onSubmit,
  loading = false,
}) {
  const selectedPermissionIds =
    formData?.permissions?.map((p) => p.id ?? p) || [];

  const title =
    modo === "ver"
      ? `Rol: ${formData?.name || ""}`
      : modo === "editar"
      ? `Editar Rol: ${formData?.name || ""}`
      : "Crear Rol";

  return (
    <ModalBase show={show} onClose={onClose} title={title} width="max-w-3xl">
      <div className="space-y-8">
        {/* Ver modo */}
        {modo === "ver" ? (
          <>
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Datos del Rol
              </h3>
              <div className="grid grid-cols-1 gap-4 bg-white rounded-xl p-4 shadow-sm">
                <DataItem label="Nombre" value={formData?.name || "-"} />
                <DataItem
                  label="Permisos"
                  value={
                    formData?.permissions?.length
                      ? formData.permissions.map((p) => p.name).join(", ")
                      : "Sin permisos asignados"
                  }
                  icon={<CheckSquare className="w-4 h-4 text-blue-600" />}
                />
              </div>
            </section>
          </>
        ) : (
          <>
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Información del Rol
              </h3>
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 gap-5 bg-gray-50 rounded-xl p-4 shadow-sm"
              >
                <InputField
                  label="Nombre del Rol"
                  name="name"
                  value={formData?.name || ""}
                  onChange={onChange}
                  required
                />
              </form>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                Permisos del Rol
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 shadow-sm">
                {permissions.length > 0 ? (
                  permissions.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-gray-700 cursor-pointer select-none"
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
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-sm">
                    No hay permisos disponibles
                  </p>
                )}
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {modo === "ver" ? (
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cerrar
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
              >
                <Save className="w-5 h-5" /> Guardar
              </button>
            </>
          )}
        </div>
      </div>
    </ModalBase>
  );
}
