import React from "react";
import ModalBase from "../../../components/ui/ModalBase";
import { UserRound, IdCard, QrCode } from "lucide-react";

export default function ModalCarnet({ show, onClose, carnet }) {
  if (!show || !carnet) return null;

  const { nombre_completo, dni, qr_image } = carnet;

  // Convertir SVG a base64 seguro para img
  const qrSrc = qr_image
    ? `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(qr_image)))}`
    : null;

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      width="max-w-lg"
      title={
        <span className="flex items-center gap-2">
          <IdCard className="w-6 h-6 text-blue-600" />
          Carnet del Beneficiario
        </span>
      }
      footer={
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end bg-white/80 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      }
    >
      <div className="flex justify-center py-6">
        <div className="w-[350px] bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-4">

          {/* Header */}
          <div className="text-center border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              CIAM - Carnet Virtual
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Centro Integral de Atención al Adulto Mayor
            </p>
          </div>

          {/* Datos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <UserRound className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">{nombre_completo}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <IdCard className="w-5 h-5 text-blue-600" />
              <span>DNI: {dni}</span>
            </div>
          </div>

          {/* QR */}
          <div className="flex justify-center pt-3">
            {qrSrc ? (
              <img
                src={qrSrc}
                alt="QR del carnet"
                className="w-40 h-40 border rounded-lg shadow"
              />
            ) : (
              <div className="text-center text-gray-400">
                <QrCode className="w-12 h-12 mx-auto mb-1" />
                <p>No se pudo cargar el QR</p>
              </div>
            )}
          </div>

          {/* Pie */}
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 pt-1">
            Válido solo para identificación dentro del CIAM.
          </p>
        </div>
      </div>
    </ModalBase>
  );
}
