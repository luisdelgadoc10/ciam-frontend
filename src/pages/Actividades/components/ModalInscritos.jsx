// src/pages/Actividades/components/ModalInscritos.jsx
import React from "react";
import { X, Users, UserPlus, UserMinus, Info } from "lucide-react";
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

  const columns = [
    {
      header: "DNI",
      accessorKey: "dni",
    },
    {
      header: "Nombre Completo",
      accessorFn: (row) => `${row.nombres || ""} ${row.apellidos || ""}`.trim(),
      cell: ({ getValue }) => {
        const nombreCompleto = getValue();
        return nombreCompleto || "Sin nombre registrado";
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const p = row.original;
        return modo === "ver" ? (
          <button
            onClick={() => onDesinscribir(p.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
          >
            <UserMinus className="w-4 h-4" />
            Desinscribir
          </button>
        ) : (
          <button
            onClick={() => onInscribir(p.id)}
            className="flex items-center gap-1 text-green-600 hover:text-green-800 transition font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Inscribir
          </button>
        );
      },
    },
  ];

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-5xl w-full max-h-[90vh] flex flex-col">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/90 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <Users className="w-6 h-6" />
              {modo === "ver"
                ? `Inscritos en: ${actividad?.nombre || "—"}`
                : `Inscribir en: ${actividad?.nombre || "—"}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {lista.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <Info className="w-6 h-6 mb-2 text-blue-600" />
                <p className="text-center text-lg">
                  No hay registros disponibles
                </p>
              </div>
            ) : (
              <CustomTable
                data={lista}
                columns={columns}
                searchable={true}
                placeholder="Buscar participante..."
              />
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end bg-white/80 rounded-b-2xl sticky bottom-0">
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
};

export default ModalInscritos;
