// src/pages/Actividades/components/ModalActividad.jsx
import React from "react";
import Portal from "../../../components/Portal";

const ModalActividad = ({
  modo = "ver", // "ver" | "editar" | "crear"
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

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {isView
                ? "Detalles de la Actividad"
                : isEdit
                ? "Editar Actividad"
                : "Crear Actividad"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          {isView ? (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="text-base font-medium text-gray-900">
                    {actividad?.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="text-base font-medium text-gray-900">
                    {actividad?.tipo_actividad?.nombre}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Descripción</p>
                  <p className="text-base font-medium text-gray-900">
                    {actividad?.descripcion}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inicio</p>
                  <p className="text-base font-medium text-gray-900">
                    {(() => {
                      let rawDate = actividad.fecha_inicio;
                      if (!rawDate) return "-";

                      // Quitar la "Z" al final si existe
                      rawDate = rawDate.replace("Z", "");

                      // Crear la fecha
                      const date = new Date(rawDate);
                      if (isNaN(date)) return "-";

                      // Formato con fecha corta + hora con segundos y AM/PM
                      return date.toLocaleString("es-PE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // activa AM/PM
                        timeZone: "America/Lima", // evita retroceso
                      });
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fin</p>
                  <p className="text-base font-medium text-gray-900">
                    {(() => {
                      let rawDate = actividad.fecha_fin;
                      if (!rawDate) return "-";
                      // Quitar la "Z" al final si existe
                      rawDate = rawDate.replace("Z", "");
                      // Crear la fecha
                      const date = new Date(rawDate);
                      if (isNaN(date)) return "-";
                      // Formato con fecha corta + hora con segundos y AM/PM
                      return date.toLocaleString("es-PE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // activa AM/PM
                        timeZone: "America/Lima", // evita retroceso
                      });
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.nombre[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Actividad
                  </label>
                  <select
                    name="tipo_actividad_id"
                    value={formData.tipo_actividad_id || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Seleccione...</option>
                    {tiposActividades.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_inicio"
                    value={formData.fecha_inicio || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_fin"
                    value={formData.fecha_fin || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    name="capacidad"
                    value={formData.capacidad || ""}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#325341] text-white rounded-lg hover:bg-[#2a4637]"
                >
                  {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default ModalActividad;
