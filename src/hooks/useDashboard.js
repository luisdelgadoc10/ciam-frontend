// src/hooks/useDashboard.js
import { useState, useEffect } from "react";
import { getDashboardStats } from "../api/services/dashboardService";

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [proximosCumpleanos, setProximosCumpleanos] = useState([]);
  const [graficos, setGraficos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardStats();

        // SETEAMOS TODA LA DATA DEL ENDPOINT
        setStats(data);
        setKpis(data.kpis);
        setProximosCumpleanos(data.proximos_cumpleanos || []);
        setGraficos(data.graficos || {});
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    stats,
    kpis,
    proximosCumpleanos,
    graficos,
    loading,
  };
}
