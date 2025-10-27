// src/pages/Beneficiarios/components/ModalAdultoView.jsx
import React from "react";
import { X } from "lucide-react";
import Portal from "../../../components/Portal";

export default function ModalAdultoView({ show, onClose, adulto, onEdit }) {
  if (!show || !adulto) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Adulto Mayor: {adulto.nombres} {adulto.apellidos}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Datos Personales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombres</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.nombres}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Apellidos</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.apellidos}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DNI</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.dni}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                  <p className="text-base font-medium text-gray-900">
                    {(() => {
                      let rawDate = adulto.fecha_nacimiento;
                      if (!rawDate) return "-";
                      // Eliminar la "Z" al final si existe
                      rawDate = rawDate.replace("Z", "");
                      // Crear la fecha
                      const date = new Date(rawDate);
                      // Verificar si es válida
                      if (isNaN(date)) return "-";
                      // Formatear en formato largo español sin desfase
                      return date.toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        timeZone: "America/Lima", // evita retroceso de día
                      });
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sexo</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.sexo?.nombre || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado Civil</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.estado_civil?.nombre || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Celular</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.celular}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Contacto de Emergencia */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Contacto de Emergencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombres</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.contacto_emergencia?.nombres || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Apellidos</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.contacto_emergencia?.apellidos || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.contacto_emergencia?.telefono || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parentesco</p>
                  <p className="text-base font-medium text-gray-900">
                    {adulto.contacto_emergencia?.parentesco?.nombre || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas de Registro */}
            {adulto.created_at && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                  Fecha de Registro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Beneficiario desde:</p>
                    <p className="text-base font-medium text-gray-900">
                      {(() => {
                        let rawDate = adulto.created_at;
                        if (!rawDate) return "-";
                        // Eliminar la "Z" al final si existe
                        rawDate = rawDate.replace("Z", "");
                        // Crear la fecha
                        const date = new Date(rawDate);
                        // Verificar si es válida
                        if (isNaN(date)) return "-";
                        // Formatear en formato largo español sin desfase
                        return date.toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          timeZone: "America/Lima", // evita retroceso de día
                        });
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                onEdit(adulto);
              }}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
