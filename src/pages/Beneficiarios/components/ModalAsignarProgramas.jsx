// src/pages/Adultos/components/ModalAsignarProgramas.jsx
import React from "react";
import { Save, ListChecks } from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";

export default function ModalAsignarProgramas({
  show,
  onClose,
  adulto = {},
  programas = [],
  assignCategoria,
  removeCategoria,
  loading = false,
}) {
  const [checked, setChecked] = React.useState([]);

  // Programas actuales del adulto mayor
  const categoriasActuales = adulto?.categorias?.map((c) => c.id) || [];

  React.useEffect(() => {
    if (show) {
      setChecked(categoriasActuales);
    }
  }, [show]);

  const handleToggle = async (programaId) => {
    const isChecked = checked.includes(programaId);

    if (isChecked) {
      // Remover categoría
      await removeCategoria(adulto.id, programaId);
      setChecked((prev) => prev.filter((id) => id !== programaId));
    } else {
      // Asignar categoría
      await assignCategoria(adulto.id, programaId);
      setChecked((prev) => [...prev, programaId]);
    }
  };

  const renderFooter = () => (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
      >
        Cerrar
      </button>
      <button
        type="button"
        disabled
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-400 text-white rounded-xl opacity-70 cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        Guardado automático
      </button>
    </>
  );

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      width="max-w-2xl"
      title={
        <span className="flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-blue-600" />
          Programas Sociales — {adulto?.nombres} {adulto?.apellidos}
        </span>
      }
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-blue-600" />
            Selecciona los Programas Sociales
          </h3>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm grid gap-4">
            {programas.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay programas disponibles.</p>
            ) : (
              programas.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600"
                    checked={checked.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    disabled={loading}
                  />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.descripcion}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        </section>
      </div>
    </ModalBase>
  );
}
