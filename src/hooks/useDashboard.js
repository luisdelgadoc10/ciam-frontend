// src/hooks/useDashboard.js
import { useState, useEffect } from "react";
import {
  getDashboardStats,
  getDashboardActivities,
  getDashboardUsers,
} from "../api/services/dashboardService";

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, activitiesData, usersData] = await Promise.all([
          getDashboardStats(),
          getDashboardActivities(),
          getDashboardUsers(),
        ]);
      } catch (error) {
        console.error(
          "Error al cargar dashboard:",
          error.config.url,
          error.response?.status,
          error.message
        );
      }
    };

    fetchAll();
  }, []);

  return {
    stats,
    activities,
    users,
    loading,
  };
}
