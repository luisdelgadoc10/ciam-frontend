import React from "react";
import { X, UserRound, Phone, Calendar, MapPin } from "lucide-react";
import Portal from "../../../components/Portal";

export default function ModalAdultoView({ show, onClose, adulto, onEdit }) {
  if (!show || !adulto) return null;

  const formatDate = (rawDate) => {
    if (!rawDate) return "-";
    rawDate = rawDate.replace("Z", "");
    const date = new Date(rawDate);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      timeZone: "America/Lima",
    });
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <UserRound className="w-6 h-6" />
              {adulto.nombres} {adulto.apellidos}
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
            {/* Sección: Datos personales */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-blue-600" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <DataItem label="Nombres" value={adulto.nombres} />
                <DataItem label="Apellidos" value={adulto.apellidos} />
                <DataItem label="DNI" value={adulto.dni} />
                <DataItem
                  label="Fecha de Nacimiento"
                  value={formatDate(adulto.fecha_nacimiento)}
                  icon={<Calendar className="w-4 h-4 text-blue-600" />}
                />
                <DataItem
                  label="Sexo"
                  value={adulto.sexo?.nombre || "N/A"}
                />
                <DataItem
                  label="Estado Civil"
                  value={adulto.estado_civil?.nombre || "N/A"}
                />
                <DataItem
                  label="Celular"
                  value={adulto.celular || "N/A"}
                  icon={<Phone className="w-4 h-4 text-blue-600" />}
                />
                <DataItem
                  label="Dirección"
                  value={adulto.direccion}
                  className="md:col-span-2"
                  icon={<MapPin className="w-4 h-4 text-blue-600" />}
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
                <DataItem
                  label="Nombres"
                  value={adulto.contacto_emergencia?.nombres || "N/A"}
                />
                <DataItem
                  label="Apellidos"
                  value={adulto.contacto_emergencia?.apellidos || "N/A"}
                />
                <DataItem
                  label="Teléfono"
                  value={adulto.contacto_emergencia?.telefono || "N/A"}
                />
                <DataItem
                  label="Parentesco"
                  value={
                    adulto.contacto_emergencia?.parentesco?.nombre || "N/A"
                  }
                />
              </div>
            </section>

            {/* Sección: Fecha de registro */}
            {adulto.created_at && (
              <section>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Fecha de Registro
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                  <DataItem
                    label="Beneficiario desde"
                    value={formatDate(adulto.created_at)}
                  />
                </div>
              </section>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 backdrop-blur-md rounded-b-2xl sticky bottom-0">
            <button
              onClick={() => {
                onClose();
                onEdit(adulto);
              }}
              className="px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* Componente reutilizable para mostrar datos */
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
