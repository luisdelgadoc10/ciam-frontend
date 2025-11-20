import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fadeIn">

      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-7 relative animate-scaleIn border border-gray-200">

        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          onClick={onCancel}
        >
          <X size={22} />
        </button>

        {/* Icono principal */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={30} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          {title}
        </h2>

        {/* Mensaje */}
        <p className="mt-3 text-gray-600 text-center leading-relaxed">
          {message}
        </p>

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-7">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition font-medium"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition font-medium shadow-sm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>

      </div>

    </div>
  );
}
