import React from "react";
import { X, Calendar, ClipboardList, UserRound, Info } from "lucide-react";
import Portal from "../../../components/Portal";

const ModalActividad = ({
  modo = "ver",
  show,
  onClose,
  actividad,
  formData,
  onChange,
  onSubmit,
  tiposActividades = [],
  errors = {},
  loading = false,
}) => {
  if (!show) return null;

  const isView = modo === "ver";
  const isEdit = modo === "editar";
  const isCreate = modo === "crear";

  const formatDateTime = (rawDate) => {
    if (!rawDate) return "-";
    rawDate = rawDate.replace("Z", "");
    const date = new Date(rawDate);
    if (isNaN(date)) return "-";
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Lima",
    });
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] flex flex-col">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              {isView
                ? "Detalles de la Actividad"
                : isEdit
                ? "Editar Actividad"
                : "Crear Actividad"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isView ? (
              <section>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Información General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                  <DataItem label="Nombre" value={actividad?.nombre} />
                  <DataItem
                    label="Tipo"
                    value={actividad?.tipo_actividad?.nombre}
                  />
                  <DataItem
                    label="Descripción"
                    value={actividad?.descripcion || "N/A"}
                    className="md:col-span-2"
                  />
                  <DataItem
                    label="Inicio"
                    value={formatDateTime(actividad?.fecha_inicio)}
                    icon={<Calendar className="w-4 h-4 text-blue-600" />}
                  />
                  <DataItem
                    label="Fin"
                    value={formatDateTime(actividad?.fecha_fin)}
                    icon={<Calendar className="w-4 h-4 text-blue-600" />}
                  />
                  <DataItem
                    label="Capacidad"
                    value={actividad?.capacidad || "N/A"}
                    icon={<UserRound className="w-4 h-4 text-blue-600" />}
                  />
                </div>
              </section>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Datos de la Actividad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                    <InputField
                      label="Nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={onChange}
                      error={errors.nombre}
                    />

                    <SelectField
                      label="Tipo de Actividad"
                      name="tipo_actividad_id"
                      value={formData.tipo_actividad_id}
                      onChange={onChange}
                      options={tiposActividades}
                    />

                    <TextAreaField
                      label="Descripción"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={onChange}
                      className="md:col-span-2"
                    />

                    <InputField
                      label="Fecha Inicio"
                      type="datetime-local"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={onChange}
                    />

                    <InputField
                      label="Fecha Fin"
                      type="datetime-local"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={onChange}
                    />

                    <InputField
                      label="Capacidad"
                      type="number"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={onChange}
                    />
                  </div>
                </section>
              </form>
            )}
          </div>

          {/* FOOTER (FIJO Y LIMPIO) */}
          {!isView && (
            <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="actividadForm"
                onClick={onSubmit}
                className="px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition"
              >
                {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default ModalActividad;

/* COMPONENTES AUXILIARES */
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

function InputField({ label, name, value, onChange, type = "text", error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccione...</option>
        {options.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={3}
        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
