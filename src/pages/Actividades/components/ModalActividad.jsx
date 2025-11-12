// src/pages/Actividades/components/ModalActividad.jsx
import React from "react";
import {
  ClipboardList,
  Calendar,
  UserRound,
  Save,
  Info,
} from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import InputField from "../../../components/ui/InputField";
import TextAreaField from "../../../components/ui/TextAreaField";
import SelectField from "../../../components/ui/SelectField";
import DataItem from "../../../components/ui/DataItem";

export default function ModalActividad({
  show,
  onClose,
  modo = "crear",
  formData = {},
  onChange,
  onSubmit,
  actividad = {},
  tiposActividades = [],
  loading = false,
}) {
  const isView = modo === "ver";
  const isEdit = modo === "editar";
  const isCreate = modo === "crear";

  const title =
    isView
      ? `Actividad: ${actividad?.nombre || ""}`
      : isEdit
      ? `Editar Actividad`
      : `Crear Actividad`;

  const formatDateTime = (rawDate) => {
    if (!rawDate) return "-";
    rawDate = rawDate.replace("Z", "");
    const date = new Date(rawDate);
    if (isNaN(date)) return "-";
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Lima",
    });
  };

  const renderFooter = () => {
    if (isView) {
      return (
        <button
          onClick={onClose}
          className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 
          hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
        >
          Cerrar
        </button>
      );
    }
    return (
      <>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 
          hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white 
          rounded-xl shadow hover:bg-blue-800 transition"
        >
          <Save className="w-5 h-5" />
          {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
        </button>
      </>
    );
  };

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6" />
          {title}
        </span>
      }
      width="max-w-3xl"
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 
          flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      {/* CONTENIDO */}
      <div className="space-y-8">
        {isView ? (
          <section>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white 
              dark:bg-slate-800 rounded-xl p-4 shadow-sm">
              <DataItem label="Nombre" value={actividad?.nombre || "-"} />
              <DataItem
                label="Tipo"
                value={actividad?.tipo_actividad?.nombre || "-"}
              />
              <DataItem
                label="Descripción"
                value={actividad?.descripcion || "N/A"}
                className="md:col-span-2"
              />
              <DataItem
                label="Inicio"
                value={formatDateTime(actividad?.fecha_inicio)}
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
              />
              <DataItem
                label="Fin"
                value={formatDateTime(actividad?.fecha_fin)}
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
              />
              <DataItem
                label="Capacidad"
                value={actividad?.capacidad || "N/A"}
                icon={<UserRound className="w-4 h-4 text-blue-600" />}
              />
            </div>
          </section>
        ) : (
          <>
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Datos de la Actividad
              </h3>
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white 
                dark:bg-slate-800 rounded-xl p-4 shadow-sm"
              >
                <InputField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={onChange}
                  required
                />

                <SelectField
                  label="Tipo de Actividad"
                  name="tipo_actividad_id"
                  value={formData.tipo_actividad_id || ""}
                  onChange={onChange}
                  options={tiposActividades}
                  placeholder="Seleccione tipo"
                />

                <TextAreaField
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={onChange}
                  className="md:col-span-2"
                />

                <InputField
                  label="Fecha Inicio"
                  type="datetime-local"
                  name="fecha_inicio"
                  value={formData.fecha_inicio || ""}
                  onChange={onChange}
                />

                <InputField
                  label="Fecha Fin"
                  type="datetime-local"
                  name="fecha_fin"
                  value={formData.fecha_fin || ""}
                  onChange={onChange}
                />

                <InputField
                  label="Capacidad"
                  type="number"
                  name="capacidad"
                  value={formData.capacidad || ""}
                  onChange={onChange}
                />
              </form>
            </section>
          </>
        )}
      </div>
    </ModalBase>
  );
}
