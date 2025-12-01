// src/pages/Asistencias/components/ModalAttendanceForm.jsx
import { useEffect } from "react";
import { UserCheck, Calendar, Save } from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import SelectField from "../../../components/ui/SelectField";
import Select from "react-select";

// Componente interno que SIEMPRE monta hooks
function ModalContent({
  modo,
  formData,
  errors,
  activities,
  inscritosActividad,
  onChange,
  onSubmit,
  loading,
  onClose,
}) {
  const isEdit = modo === "editar";

  // ✅ CORREGIDO: Usar onChange en lugar de setFormData
  useEffect(() => {
    if (!formData.activity_id) return;

    const timer = setTimeout(() => {
      const selectedActivity = activities.find(
        (act) => Number(act.id) === Number(formData.activity_id)
      );

      if (selectedActivity?.fecha_inicio) {
        const fecha = new Date(selectedActivity.fecha_inicio)
          .toISOString()
          .split("T")[0];

        if (formData.attendance_date !== fecha) {
          // ✅ Usar onChange para actualizar el estado
          onChange({
            target: {
              name: "attendance_date",
              value: fecha,
            },
          });
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [formData.activity_id, activities, formData.attendance_date, onChange]);

  const renderFooter = () => (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
      >
        Cancelar
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={loading || !formData.activity_id || inscritosActividad.length === 0}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {loading ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
      </button>
    </>
  );

  return (
    <ModalBase
      show={true}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" />
          {isEdit ? "Editar Asistencia" : "Registrar Asistencia"}
        </span>
      }
      width="max-w-2xl"
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      <div className="space-y-8">
        {/* Sección: Información de Asistencia */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Información de Asistencia
          </h3>
          <div className="space-y-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            {/* 🔵 ACTIVIDAD CON react-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Actividad <span className="text-red-500">*</span>
              </label>
              <Select
                isDisabled={isEdit}
                value={
                  activities
                    .map((a) => ({
                      value: a.id,
                      label: a.nombre || a.name,
                    }))
                    .find((opt) => opt.value === formData.activity_id) || null
                }
                onChange={(selected) => {
                  onChange({
                    target: {
                      name: "activity_id",
                      value: selected ? selected.value : "",
                    },
                  });
                }}
                options={activities.map((a) => ({
                  value: a.id,
                  label: a.nombre || a.name,
                }))}
                placeholder="Seleccione una actividad..."
                noOptionsMessage={() => "No hay actividades disponibles"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderRadius: '0.75rem',
                  }),
                }}
              />
              {errors.activity_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.activity_id[0]}
                </p>
              )}
            </div>

            {/* Adulto Mayor */}
            <div>
              <SelectField
                label="Adulto Mayor Inscrito"
                name="adulto_mayor_id"
                value={formData.adulto_mayor_id}
                onChange={onChange}
                options={inscritosActividad.map((adulto) => ({
                  id: adulto.id,
                  nombre: `${adulto.nombres} ${adulto.apellidos} - ${adulto.dni}`,
                }))}
                disabled={!formData.activity_id || isEdit}
                required
                error={errors.adulto_mayor_id}
              />
              {formData.activity_id && inscritosActividad.length === 0 && (
                <p className="text-amber-600 dark:text-amber-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> Esta actividad no tiene adultos mayores inscritos.
                </p>
              )}
            </div>

            {/* Fecha de Asistencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Asistencia <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="date"
                  name="attendance_date"
                  value={formData.attendance_date || ""}
                  readOnly
                  required
                  className="w-full pl-10 pr-3 py-2.5 border rounded-xl bg-gray-100 dark:bg-slate-700 cursor-not-allowed opacity-60 border-gray-300 dark:border-slate-600 dark:text-gray-300 focus:outline-none"
                />
              </div>
              {errors.attendance_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.attendance_date[0]}
                </p>
              )}
            </div>

            {/* Estado */}
            <SelectField
              label="Estado"
              name="status"
              value={formData.status}
              onChange={onChange}
              options={[
                { id: "asistió", nombre: "Asistió" },
                { id: "falta", nombre: "Falta" },
                { id: "tardanza", nombre: "Tardanza" },
                { id: "justificado", nombre: "Justificado" },
              ]}
              required
              error={errors.status}
            />
          </div>
        </section>
      </div>
    </ModalBase>
  );
}

// Componente exterior
export default function ModalAttendanceForm(props) {
  if (!props.show) return null;
  return <ModalContent {...props} />;
}