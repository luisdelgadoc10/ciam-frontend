// src/pages/Actividades/components/ModalInscritos.jsx
import React from "react";
import Portal from "../../../components/Portal";
import CustomTable from "../../../components/ui/CustomTable";

const ModalInscritos = ({
  show,
  onClose,
  actividad,
  inscritos = [],
  adultosDisponibles = [],
  onInscribir,
  onDesinscribir,
  modo = "ver", // "ver" o "inscribir"
}) => {
  if (!show) return null;

  const lista = modo === "ver" ? inscritos : adultosDisponibles;

  // 🔹 Definir las columnas para CustomTable
  const columns = [
    {
      header: "DNI",
      accessorKey: "dni",
    },
    {
      header: "Nombre Completo",
      cell: ({ row }) => {
        const p = row.original;
        const nombres = p.nombres || "";
        const apellidos = p.apellidos || "";
        const nombreCompleto = `${nombres} ${apellidos}`.trim();

        return nombreCompleto ? nombreCompleto : "Sin nombre registrado";
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const p = row.original;
        return modo === "ver" ? (
          <button
            onClick={() => onDesinscribir(p.id)}
            className="text-red-600 hover:text-red-800 transition"
          >
            Desinscribir
          </button>
        ) : (
          <button
            onClick={() => onInscribir(p.id)}
            className="text-green-600 hover:text-green-800 transition"
          >
            Inscribir
          </button>
        );
      },
    },
  ];

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* 🔹 Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {modo === "ver"
                ? `Inscritos en: ${actividad?.nombre || "—"}`
                : `Inscribir en: ${actividad?.nombre || "—"}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          {/* 🔹 Contenido */}
          <div className="p-6">
            {lista.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay registros disponibles
              </p>
            ) : (
              <CustomTable data={lista} columns={columns} searchable={true} />
            )}
          </div>

          {/* 🔹 Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ModalInscritos;
