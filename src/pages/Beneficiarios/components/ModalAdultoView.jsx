// src/pages/Adultos/components/ModalAdultoView.jsx
import React from "react";
import {
  UserRound,
  Phone,
  Calendar,
  MapPin,
  HeartPulse,
  SquarePen,
} from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import DataItem from "../../../components/ui/DataItem";

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

  const renderFooter = () => (
    <>
      <button
        onClick={onClose}
        className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
      >
        Cerrar
      </button>
      <button
        onClick={() => {
          onClose();
          onEdit(adulto);
        }}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition"
      >
        <SquarePen className="w-5 h-5" /> Editar
      </button>
    </>
  );

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      width="max-w-4xl"
      title={
        <span className="flex items-center gap-2">
          <UserRound className="w-6 h-6 text-blue-600" />
          {adulto.nombres} {adulto.apellidos}
        </span>
      }
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      <div className="space-y-8">
        {/* Datos personales con foto a la izquierda */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <UserRound className="w-5 h-5 text-blue-600" />
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
            {/* FOTO a la izquierda */}
            <div className="flex flex-col items-center justify-start gap-4">
              <div className="w-36 h-48 flex items-center justify-center bg-gray-50 dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden shadow-sm">
                {adulto.foto_url ? (
                  <img
                    src={adulto.foto_url}
                    alt="Foto carnet"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-2">
                    <UserRound className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Foto carnet
                      <br />
                      (3×4 cm)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* INFO a la derecha de la foto */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <DataItem label="Nombres" value={adulto.nombres} />
              <DataItem label="Apellidos" value={adulto.apellidos} />
              <DataItem label="DNI" value={adulto.dni} />
              <DataItem
                label="Fecha de Nacimiento"
                value={formatDate(adulto.fecha_nacimiento)}
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
              />
              <DataItem label="Sexo" value={adulto.sexo?.nombre || "N/A"} />
              <DataItem
                label="Estado Civil"
                value={adulto.estado_civil?.nombre || "N/A"}
              />
              <DataItem
                label="Dirección"
                value={adulto.direccion || "N/A"}
                icon={<MapPin className="w-4 h-4 text-blue-600" />}
                className="md:col-span-2"
              />
              <DataItem
                label="Celular"
                value={adulto.celular || "N/A"}
                icon={<Phone className="w-4 h-4 text-blue-600" />}
              />
            </div>
          </div>
        </section>

        {/* Contacto de emergencia */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-500" />
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
              value={adulto.contacto_emergencia?.parentesco?.nombre || "N/A"}
            />
          </div>
        </section>

        {/* Fecha de registro */}
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
    </ModalBase>
  );
}
