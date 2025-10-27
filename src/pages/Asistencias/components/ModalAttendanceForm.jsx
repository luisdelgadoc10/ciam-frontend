// src/pages/Asistencias/components/ModalAttendanceForm.jsx
import { X } from "lucide-react";
import { useEffect } from "react";

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
  setFormData,
  onClose,
}) {
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
          setFormData((prev) => ({
            ...prev,
            attendance_date: fecha,
          }));
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [formData.activity_id, activities, formData.attendance_date, setFormData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {modo === "crear" ? "Registrar Asistencia" : "Editar Asistencia"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* ... (todo el formulario igual) ... */}
          {/* Actividad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actividad <span className="text-red-500">*</span>
            </label>
            <select
              name="activity_id"
              value={formData.activity_id}
              onChange={onChange}
              disabled={modo === "editar"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.activity_id ? "border-red-500" : "border-gray-300"
              } ${modo === "editar" ? "bg-gray-100 cursor-not-allowed" : ""}`}
              required
            >
              <option value="">Seleccione una actividad</option>
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.nombre || act.name}
                </option>
              ))}
            </select>
            {errors.activity_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.activity_id[0]}
              </p>
            )}
          </div>

          {/* Adulto Mayor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adulto Mayor Inscrito <span className="text-red-500">*</span>
            </label>
            <select
              name="adulto_mayor_id"
              value={formData.adulto_mayor_id}
              onChange={onChange}
              disabled={!formData.activity_id || modo === "editar"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.adulto_mayor_id ? "border-red-500" : "border-gray-300"
              } ${
                !formData.activity_id || modo === "editar"
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
              required
            >
              <option value="">
                {!formData.activity_id
                  ? "Primero selecciona una actividad"
                  : inscritosActividad.length === 0
                  ? "No hay adultos mayores inscritos"
                  : "Seleccione un adulto mayor"}
              </option>
              {inscritosActividad.map((adulto) => (
                <option key={adulto.id} value={adulto.id}>
                  {adulto.nombres} {adulto.apellidos} - {adulto.dni}
                </option>
              ))}
            </select>
            {errors.adulto_mayor_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.adulto_mayor_id[0]}
              </p>
            )}
            {formData.activity_id && inscritosActividad.length === 0 && (
              <p className="text-amber-600 text-sm mt-1">
                ⚠️ Esta actividad no tiene adultos mayores inscritos.
              </p>
            )}
          </div>

          {/* Fecha de Asistencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Asistencia <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="attendance_date"
              value={formData.attendance_date || ""}
              readOnly
              className={`w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed ${
                errors.attendance_date ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.attendance_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.attendance_date[0]}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="asistió">Asistió</option>
              <option value="falta">Falta</option>
              <option value="tardanza">Tardanza</option>
              <option value="justificado">Justificado</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.activity_id ||
                inscritosActividad.length === 0
              }
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading
                ? "Guardando..."
                : modo === "crear"
                ? "Registrar"
                : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente exterior: controla la condición de renderizado
export default function ModalAttendanceForm(props) {
  if (!props.show) return null;
  return <ModalContent {...props} />;
}