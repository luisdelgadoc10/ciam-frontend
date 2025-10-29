// src/components/ui/ModalBase.jsx
import React from "react";
import { X } from "lucide-react";
import Portal from "../Portal";

export default function ModalBase({
  show,
  onClose,
  title,
  width = "max-w-lg",
  children,
  footer, // 👈 nueva prop opcional
}) {
  if (!show) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div
          className={`bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 w-full ${width} max-h-[90vh] flex flex-col`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-slate-900/90 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Footer (opcional) */}
          {footer && (
            <div className="shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}