// src/pages/Cumpleanos/CumpleanosCalendarioPage.jsx
import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import useAdultosMayores from "../../hooks/useAdultosMayores";
import Calendario from "../../components/ui/Calendario";

export default function CumpleanosCalendarioPage() {
  const { fetchTodosCumpleanos } = useAdultosMayores();
  const [adultosMayores, setAdultosMayores] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  useEffect(() => {
    const cargarCumpleanos = async () => {
      setLoading(true);
      const cumpleanos = await fetchTodosCumpleanos();
      setAdultosMayores(cumpleanos);
      setLoading(false);
    };
    cargarCumpleanos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Cargando cumpleaños...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="w-6 h-6 text-blue-600" />
            Calendario de Cumpleaños
          </h1>
          <p className="text-gray-600">
            Visualiza los cumpleaños de {adultosMayores.length} Adultos Mayores
          </p>
        </div>
      </div>

      <Calendario
        adultosMayores={adultosMayores}
        currentYear={currentYear}
        currentMonth={currentMonth}
        setCurrentYear={setCurrentYear}
        setCurrentMonth={setCurrentMonth}
      />
    </div>
  );
}
