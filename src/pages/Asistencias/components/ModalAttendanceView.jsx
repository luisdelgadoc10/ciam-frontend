// src/pages/Asistencias/components/ModalAttendanceView.jsx
import { X, Edit, Calendar, User, Activity, CheckCircle } from "lucide-react";
import Portal from "../../../components/Portal";

export default function ModalAttendanceView({
  show,
  onClose,
  attendance,
  onEdit,
}) {
  if (!show || !attendance) return null;

  const getEstadoBadge = (status) => {
    const badges = {
      asistió:
        "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium",
      falta:
        "bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium",
      tardanza:
        "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium",
      justificado:
        "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium",
    };
    return (
      badges[status] ||
      "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
    );
  };

  const getEstadoLabel = (status) => {
    const labels = {
      asistió: "Asistió",
      falta: "Falta",
      tardanza: "Tardanza",
      justificado: "Justificado",
    };
    return labels[status] || status;
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Detalle de Asistencia
                </h2>
                <p className="text-sm text-gray-600">
                  Registro #{attendance.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Fecha y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Fecha de Asistencia
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {(() => {
                    let rawDate = attendance.attendance_date;
                    if (!rawDate) return "N/A";

                    // Quitar la "Z" al final si existe
                    rawDate = rawDate.replace("Z", "");

                    // Crear la fecha
                    const date = new Date(rawDate);
                    if (isNaN(date)) return "N/A";

                    // Formatear en español de Perú, sin desfase horario
                    return date.toLocaleDateString("es-PE", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "America/Lima", // evita el retroceso de 5 horas
                    });
                  })()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Estado</span>
                </div>
                <span className={getEstadoBadge(attendance.status)}>
                  {getEstadoLabel(attendance.status)}
                </span>
              </div>
            </div>

            {/* Actividad */}
            {/* <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Actividad</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xl font-bold text-blue-900 mb-2">
                  {attendance.activities?.nombre || "N/A"}
                </p>
                {attendance.activities?.descripcion && (
                  <p className="text-gray-700 mb-3">
                    {attendance.activities.descripcion}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.activities?.tipo_actividad?.nombre || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ubicación:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.activities?.ubicacion || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha inicio:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.activities?.fecha_inicio
                        ? new Date(
                            attendance.activities.fecha_inicio
                          ).toLocaleString("es-PE")
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha fin:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.activities?.fecha_fin
                        ? new Date(
                            attendance.activities.fecha_fin
                          ).toLocaleString("es-PE")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Adulto Mayor */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Adulto Mayor</h3>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-xl font-bold text-green-900 mb-3">
                  {attendance.adulto_mayor?.nombres}{" "}
                  {attendance.adulto_mayor?.apellidos}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">DNI:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.adulto_mayor?.dni || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de nacimiento:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {(() => {
                        let rawDate = attendance.adulto_mayor?.fecha_nacimiento;
                        if (!rawDate) return "N/A";

                        // Quitar la "Z" al final si existe
                        rawDate = rawDate.replace("Z", "");

                        // Crear la fecha
                        const date = new Date(rawDate);
                        if (isNaN(date)) return "N/A";

                        // Formatear al estilo peruano con hora y AM/PM
                        return date.toLocaleString("es-PE", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour12: true,
                          timeZone: "America/Lima", // evita que reste 5 horas
                        });
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Celular:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.adulto_mayor?.celular || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dirección:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {attendance.adulto_mayor?.direccion || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas de registro */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Registrado:</span>
                  <span className="ml-2">
                    {(() => {
                      let rawDate = attendance.created_at;
                      if (!rawDate) return "N/A";

                      // Quitar la "Z" al final si existe
                      rawDate = rawDate.replace("Z", "");

                      // Crear la fecha
                      const date = new Date(rawDate);
                      if (isNaN(date)) return "N/A";

                      // Formatear al estilo peruano con hora y AM/PM
                      return date.toLocaleString("es-PE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "America/Lima", // evita que reste 5 horas
                      });
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cerrar
            </button>
            {/* <button
            onClick={() => {
              onEdit(attendance);
              onClose();
            }}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 transition flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button> */}
          </div>
        </div>
      </div>
    </Portal>
  );
}
