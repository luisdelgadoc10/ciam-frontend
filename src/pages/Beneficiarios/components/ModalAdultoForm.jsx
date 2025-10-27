// src/pages/Beneficiarios/components/ModalAdultoForm.jsx
import React from "react";
import { X, Save } from "lucide-react";
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

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {modo === "editar"
                ? `Editar Adulto Mayor: ${formData?.nombres || ""}`
                : "Registrar Adulto Mayor"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {/* Datos Personales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData?.nombres || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.nombres && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombres[0]}</p>
                  )}
                </div>

                {/* Apellidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData?.apellidos || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.apellidos && (
                    <p className="text-red-500 text-xs mt-1">{errors.apellidos[0]}</p>
                  )}
                </div>

                {/* DNI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData?.dni || ""}
                    onChange={onChange}
                    maxLength="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.dni && (
                    <p className="text-red-500 text-xs mt-1">{errors.dni[0]}</p>
                  )}
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData?.fecha_nacimiento || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.fecha_nacimiento && (
                    <p className="text-red-500 text-xs mt-1">{errors.fecha_nacimiento[0]}</p>
                  )}
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sexo_id"
                    value={formData?.sexo_id || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {sexos.map(sexo => (
                      <option key={sexo.id} value={sexo.id}>{sexo.nombre}</option>
                    ))}
                  </select>
                  {errors.sexo_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.sexo_id[0]}</p>
                  )}
                </div>

                {/* Estado Civil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado Civil <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado_civil_id"
                    value={formData?.estado_civil_id || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {estadosCiviles.map(estado => (
                      <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                    ))}
                  </select>
                  {errors.estado_civil_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.estado_civil_id[0]}</p>
                  )}
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData?.direccion || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.direccion && (
                    <p className="text-red-500 text-xs mt-1">{errors.direccion[0]}</p>
                  )}
                </div>

                {/* Celular */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="celular"
                    value={formData?.celular || ""}
                    onChange={onChange}
                    maxLength="9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.celular && (
                    <p className="text-red-500 text-xs mt-1">{errors.celular[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contacto de Emergencia */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia_nombres"
                    value={formData?.contacto_emergencia_nombres || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.contacto_emergencia_nombres && (
                    <p className="text-red-500 text-xs mt-1">{errors.contacto_emergencia_nombres[0]}</p>
                  )}
                </div>

                {/* Apellidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia_apellidos"
                    value={formData?.contacto_emergencia_apellidos || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.contacto_emergencia_apellidos && (
                    <p className="text-red-500 text-xs mt-1">{errors.contacto_emergencia_apellidos[0]}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia_telefono"
                    value={formData?.contacto_emergencia_telefono || ""}
                    onChange={onChange}
                    maxLength="9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  />
                  {errors.contacto_emergencia_telefono && (
                    <p className="text-red-500 text-xs mt-1">{errors.contacto_emergencia_telefono[0]}</p>
                  )}
                </div>

                {/* Parentesco */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parentesco <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="parentesco_id"
                    value={formData?.parentesco_id || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#325341]"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {parentescos.map(parentesco => (
                      <option key={parentesco.id} value={parentesco.id}>{parentesco.nombre}</option>
                    ))}
                  </select>
                  {errors.parentesco_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.parentesco_id[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
              >
                <Save size={16} /> 
                {loading ? "Guardando..." : (modo === "editar" ? "Actualizar" : "Registrar")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}