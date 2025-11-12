// src/pages/Usuarios/components/ModalUsuario.jsx
import React from "react";
import {
  X,
  Save,
  UserRound,
  Mail,
  Lock,
  Calendar,
  Shield,
} from "lucide-react";
import Checkbox from "../../../components/ui/Checkbox";
import ModalBase from "../../../components/ui/ModalBase";
import InputField from "../../../components/ui/InputField";
import DataItem from "../../../components/ui/DataItem";

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

  // ✅ Prevención segura si formData llega null o vacío
  const selectedRoleIds =
    formData?.roles?.map((r) => (typeof r === "object" ? r.id : r)) || [];

  const title =
    modo === "ver"
      ? `Usuario: ${formData?.nombre || ""} ${formData?.apellido || ""}`
      : modo === "editar"
      ? `Editar Usuario: ${formData?.nombre || ""}`
      : "Crear Usuario";

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <UserRound className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          {title}
        </span>
      }
      width="max-w-3xl"
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
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
      }
    >
      <div className="space-y-8">
        {modo === "ver" ? (
          <>
            {/* === INFORMACIÓN DEL USUARIO === */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-blue-600" />
                Datos del Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <DataItem label="Nombre" value={formData?.nombre || "-"} />
                <DataItem label="Apellido" value={formData?.apellido || "-"} />
                <DataItem
                  label="Correo"
                  value={formData?.email || "-"}
                  icon={<Mail className="w-4 h-4 text-blue-600" />}
                />
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
            {/* === FORMULARIO === */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-blue-600" />
                Información del Usuario
              </h3>
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
              >
                <InputField
                  label="Nombre"
                  name="nombre"
                  value={formData?.nombre || ""}
                  onChange={onChange}
                  required
                />
                <InputField
                  label="Apellido"
                  name="apellido"
                  value={formData?.apellido || ""}
                  onChange={onChange}
                  required
                />
                <InputField
                  label="Usuario"
                  name="usuario"
                  value={formData?.usuario || ""}
                  onChange={onChange}
                  required
                />
                <InputField
                  type="email"
                  label="Correo electrónico"
                  name="email"
                  value={formData?.email || ""}
                  onChange={onChange}
                  required
                />
                <InputField
                  type="date"
                  label="Fecha de Nacimiento"
                  name="fecha_de_nacimiento"
                  value={formData?.fecha_de_nacimiento || ""}
                  onChange={onChange}
                  required
                />

                {modo === "crear" && (
                  <>
                    <InputField
                      type="password"
                      label="Contraseña"
                      name="password"
                      value={formData?.password || ""}
                      onChange={onChange}
                      required
                    />
                    <InputField
                      type="password"
                      label="Confirmar Contraseña"
                      name="password_confirmation"
                      value={formData?.password_confirmation || ""}
                      onChange={onChange}
                      required
                    />
                  </>
                )}
              </form>
            </section>

            {/* === ROLES === */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Roles del Usuario
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <Checkbox
                      key={role.id}
                      id={`role-${role.id}`}
                      name="roles"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={(e) => onRoleChange(role.id, e.target.checked)}
                      label={role.name}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm col-span-full">
                    No hay roles disponibles
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </ModalBase>
  );
}
