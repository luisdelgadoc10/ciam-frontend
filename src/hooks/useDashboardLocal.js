// src/hooks/useDashboardLocal.js
import { useMemo } from "react";
import useUsuarios from "./useUsuarios";
import useActividades from "./useActividades";

export default function useDashboardLocal() {
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { actividades, loading: loadingActividades } = useActividades();

  // Asegurarnos de que siempre sean arrays
  const usuariosArray = Array.isArray(usuarios) ? usuarios : [];
  const actividadesArray = Array.isArray(actividades) ? actividades : [];

  const stats = useMemo(() => {
    return {
      total_users: usuariosArray.length,
      total_activities: actividadesArray.length,
    };
  }, [usuariosArray, actividadesArray]);

  const loading = loadingUsuarios || loadingActividades;

  return {
    stats,
    activities: actividadesArray,  // puedes mostrar las últimas 5 en el dashboard
    users: usuariosArray,          // puedes mostrar los últimos 5 usuarios
    loading,
  };
}
