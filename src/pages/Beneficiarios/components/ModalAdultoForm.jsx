// src/pages/Beneficiarios/components/ModalAdultoForm.jsx
import React from "react";
import { X, Save, UserRound, Phone, Calendar, MapPin } from "lucide-react";
import Portal from "../../../components/Portal";

export default function ModalAdultoForm({
  show,
  onClose,
  modo = "crear", // "crear" | "editar"
  formData = {},
  errors = {},
  sexos = [],
  estadosCiviles = [],
  parentescos = [],
  onChange,
  onSubmit,
  loading = false,
}) {
  if (!show) return null;

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <UserRound className="w-6 h-6" />
              {modo === "editar"
                ? `Editar Adulto Mayor: ${formData?.nombres || ""}`
                : "Registrar Adulto Mayor"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={onSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-8"
          >
            {/* Sección: Datos personales */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-blue-600" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                {/* Campos personales */}
                {[
                  {
                    label: "Nombres",
                    name: "nombres",
                    type: "text",
                    required: true,
                  },
                  {
                    label: "Apellidos",
                    name: "apellidos",
                    type: "text",
                    required: true,
                  },
                  {
                    label: "DNI",
                    name: "dni",
                    type: "text",
                    required: true,
                    maxLength: 8,
                  },
                  {
                    label: "Fecha de Nacimiento",
                    name: "fecha_nacimiento",
                    type: "date",
                    required: true,
                    icon: <Calendar className="w-4 h-4 text-blue-600" />,
                  },
                ].map((f) => (
                  <FormField
                    key={f.name}
                    {...f}
                    value={
                      f.name === "fecha_nacimiento"
                        ? formatDateForInput(formData?.fecha_nacimiento)
                        : formData?.[f.name] || ""
                    }
                    onChange={onChange}
                    errors={errors}
                  />
                ))}

                {/* Sexo */}
                <SelectField
                  label="Sexo"
                  name="sexo_id"
                  value={formData?.sexo_id || ""}
                  onChange={onChange}
                  required
                  options={sexos}
                  errors={errors}
                />

                {/* Estado Civil */}
                <SelectField
                  label="Estado Civil"
                  name="estado_civil_id"
                  value={formData?.estado_civil_id || ""}
                  onChange={onChange}
                  required
                  options={estadosCiviles}
                  errors={errors}
                />

                {/* Dirección */}
                <FormField
                  label="Dirección"
                  name="direccion"
                  type="text"
                  required
                  icon={<MapPin className="w-4 h-4 text-blue-600" />}
                  value={formData?.direccion || ""}
                  onChange={onChange}
                  errors={errors}
                  className="md:col-span-2"
                />

                {/* Celular */}
                <FormField
                  label="Celular"
                  name="celular"
                  type="text"
                  required
                  maxLength="9"
                  icon={<Phone className="w-4 h-4 text-blue-600" />}
                  value={formData?.celular || ""}
                  onChange={onChange}
                  errors={errors}
                />
              </div>
            </section>

            {/* Sección: Contacto de emergencia */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Contacto de Emergencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <FormField
                  label="Nombres"
                  name="contacto_emergencia_nombres"
                  type="text"
                  required
                  value={formData?.contacto_emergencia_nombres || ""}
                  onChange={onChange}
                  errors={errors}
                />
                <FormField
                  label="Apellidos"
                  name="contacto_emergencia_apellidos"
                  type="text"
                  required
                  value={formData?.contacto_emergencia_apellidos || ""}
                  onChange={onChange}
                  errors={errors}
                />
                <FormField
                  label="Teléfono"
                  name="contacto_emergencia_telefono"
                  type="text"
                  required
                  maxLength="9"
                  value={formData?.contacto_emergencia_telefono || ""}
                  onChange={onChange}
                  errors={errors}
                />
                <SelectField
                  label="Parentesco"
                  name="parentesco_id"
                  value={formData?.parentesco_id || ""}
                  onChange={onChange}
                  required
                  options={parentescos}
                  errors={errors}
                />
              </div>
            </section>
          </form>

          {/* FOOTER */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 backdrop-blur-md rounded-b-2xl sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form"
              disabled={loading}
              onClick={onSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading
                ? "Guardando..."
                : modo === "editar"
                ? "Actualizar"
                : "Registrar"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* --- COMPONENTES AUXILIARES --- */

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  errors,
  required = false,
  maxLength,
  icon,
  className = "",
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="flex items-center gap-2">
        {icon && icon}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength || undefined}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 dark:text-gray-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  required = false,
  options = [],
  errors,
  className = "",
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 dark:text-gray-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        <option value="">Seleccione...</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.nombre}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  );
}
