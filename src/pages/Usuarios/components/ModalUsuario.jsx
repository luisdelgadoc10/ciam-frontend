import React from "react";
import { X, Save, UserRound, Mail, Lock, Calendar, Shield } from "lucide-react";
import Checkbox from "../../../components/ui/Checkbox";
import Portal from "../../../components/Portal";

export default function ModalUsuario({
  show,
  onClose,
  modo = "crear",
  formData = {},
  roles = [],
  onChange,
  onRoleChange,
  onSubmit,
  loading = false,
}) {
  if (!show) return null;

  const selectedRoleIds =
    formData.roles?.map((r) => (typeof r === "object" ? r.id : r)) || [];

  const title =
    modo === "ver"
      ? `Usuario: ${formData?.nombre || ""} ${formData?.apellido || ""}`
      : modo === "editar"
      ? `Editar Usuario: ${formData?.nombre || ""}`
      : "Crear Usuario";

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all">
          
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-slate-900/90 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <UserRound className="w-6 h-6" />
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-8">
            {modo === "ver" ? (
              <>
                {/* Información del usuario */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <UserRound className="w-5 h-5 text-blue-600" />
                    Datos del Usuario
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                    <DataItem label="Nombre" value={formData?.nombre || "-"} />
                    <DataItem label="Apellido" value={formData?.apellido || "-"} />
                    <DataItem label="Correo" value={formData?.email || "-"} icon={<Mail className="w-4 h-4 text-blue-600" />} />
                    <DataItem
                      label="Fecha de Nacimiento"
                      value={formData?.fecha_de_nacimiento || "-"}
                      icon={<Calendar className="w-4 h-4 text-blue-600" />}
                    />
                    <DataItem
                      label="Roles"
                      value={
                        formData?.roles?.length
                          ? formData.roles
                              .map((r) => (typeof r === "object" ? r.name : ""))
                              .join(", ")
                          : "Sin roles"
                      }
                      icon={<Shield className="w-4 h-4 text-blue-600" />}
                      className="md:col-span-2"
                    />
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Formulario */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <UserRound className="w-5 h-5 text-blue-600" />
                    Información del Usuario
                  </h3>
                  <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                    <Input label="Nombre" name="nombre" value={formData?.nombre || ""} onChange={onChange} required />
                    <Input label="Apellido" name="apellido" value={formData?.apellido || ""} onChange={onChange} required />
                    <Input label="Usuario" name="usuario" value={formData?.usuario || ""} onChange={onChange} required />
                    <Input type="email" label="Correo electrónico" name="email" value={formData?.email || ""} onChange={onChange} required />
                    <Input type="date" label="Fecha de Nacimiento" name="fecha_de_nacimiento" value={formData?.fecha_de_nacimiento || ""} onChange={onChange} required />

                    {modo === "crear" && (
                      <>
                        <Input type="password" label="Contraseña" name="password" value={formData?.password || ""} onChange={onChange} required />
                        <Input type="password" label="Confirmar Contraseña" name="password_confirmation" value={formData?.password_confirmation || ""} onChange={onChange} required />
                      </>
                    )}
                  </form>
                </section>

                {/* Roles */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Roles del Usuario
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
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
                </section>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl sticky bottom-0">
            {modo === "ver" ? (
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
              >
                Cerrar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={onSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition"
                  disabled={loading}
                >
                  <Save className="w-5 h-5" /> Guardar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* Subcomponentes reutilizables */
function Input({ label, type = "text", name, value, onChange, required }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}

function DataItem({ label, value, icon, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium">
        {icon && icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
