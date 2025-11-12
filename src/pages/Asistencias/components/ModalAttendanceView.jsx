// src/pages/Asistencias/components/ModalAttendanceView.jsx
import {
  Calendar,
  User,
  CheckCircle,
  Phone,
  MapPin,
} from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import DataItem from "../../../components/ui/DataItem";

export default function ModalAttendanceView({ show, onClose, attendance }) {
  if (!show || !attendance) return null;

  const getEstadoBadge = (status) => {
    const badges = {
      asistió:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium",
      falta:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium",
      tardanza:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium",
      justificado:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium",
    };
    return (
      badges[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium"
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

  // Solo fecha
  const formatDate = (rawDate) => {
    if (!rawDate) return "-";
    const date = new Date(rawDate);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      timeZone: "America/Lima", // UTC-5
    });
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
      title={
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Detalle de Asistencia
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Registro #{attendance.id}
            </p>
          </div>
        </div>
      }
      width="max-w-3xl"
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      <div className="space-y-8">
        {/* Información de asistencia */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Información de Asistencia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Fecha de Asistencia</span>
              </div>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                {formatDate(attendance.attendance_date)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Estado</span>
              </div>
              <span className={getEstadoBadge(attendance.status)}>
                {getEstadoLabel(attendance.status)}
              </span>
            </div>
          </div>
        </section>

        {/* Adulto Mayor */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Adulto Mayor
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {attendance.adulto_mayor?.nombres}{" "}
              {attendance.adulto_mayor?.apellidos}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataItem
                label="DNI"
                value={attendance.adulto_mayor?.dni || "-"}
              />
              <DataItem
                label="Fecha de nacimiento"
                value={formatDate(attendance.adulto_mayor?.fecha_nacimiento)}
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
              />
              <DataItem
                label="Celular"
                value={attendance.adulto_mayor?.celular || "-"}
                icon={<Phone className="w-4 h-4 text-blue-600" />}
              />
              <DataItem
                label="Dirección"
                value={attendance.adulto_mayor?.direccion || "-"}
                icon={<MapPin className="w-4 h-4 text-blue-600" />}
              />
            </div>
          </div>
        </section>
      </div>
    </ModalBase>
  );
}
