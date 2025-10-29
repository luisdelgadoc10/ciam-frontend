import React from "react";
import { X } from "lucide-react";
import Portal from "../Portal";

export default function ModalBase({ show, onClose, title, width = "max-w-lg", children }) {
  if (!show) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div
          className={`bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 w-full ${width} max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white/95 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </Portal>
  );
}
