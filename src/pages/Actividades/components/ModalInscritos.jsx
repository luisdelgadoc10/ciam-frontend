import React from "react";
import { Users, UserPlus, UserMinus, Info, Download } from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import CustomTable from "../../../components/ui/CustomTable";

export default function ModalInscritos({
  show,
  onClose,
  actividad,
  inscritos = [],
  adultosDisponibles = [],
  onInscribir,
  onDesinscribir,
  handleDownloadExcel, // ✅ nueva prop
  modo = "ver", // "ver" o "inscribir"
}) {
  const lista = modo === "ver" ? inscritos : adultosDisponibles;

  const columns = [
    { header: "DNI", accessorKey: "dni" },
    {
      header: "Nombre Completo",
      accessorFn: (row) => `${row.nombres || ""} ${row.apellidos || ""}`.trim(),
      cell: ({ getValue }) => getValue() || "Sin nombre registrado",
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

  const title = (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-700 dark:text-blue-400" />
        {modo === "ver"
          ? `Inscritos en: ${actividad?.nombre || "—"}`
          : `Inscribir en: ${actividad?.nombre || "—"}`}
      </span>

      {modo === "ver" && actividad?.id && handleDownloadExcel && (
        <button
          onClick={() => handleDownloadExcel(actividad)}
          className="flex items-center gap-1 ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Excel de Inscritos
        </button>
      )}
    </div>
  );

  const renderBody = () => {
    if (lista.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Info className="w-6 h-6 mb-2 text-blue-600" />
          <p className="text-center text-lg">No hay registros disponibles</p>
        </div>
      );
    }
    return (
      <CustomTable
        data={lista}
        columns={columns}
        searchable={true}
        placeholder="Buscar participante..."
      />
    );
  };

  const renderFooter = () => (
    <button
      onClick={onClose}
      className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
    >
      Cerrar
    </button>
  );

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      title={title}
      width="max-w-5xl"
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      <div className="space-y-8">{renderBody()}</div>
    </ModalBase>
  );
}
