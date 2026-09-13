import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = "https://rackdcim-api.onrender.com/fleet/status";

async function fetchFleetStatus() {
  const response = await axios.get(API_URL);
  return response.data;
}

export function useFleetStatus() {
  const { data: fleetData, error } = useQuery({
    queryKey: ["fleetStatus"],
    queryFn: fetchFleetStatus,
  });

  // Keep a rolling history for the trend chart — React Query caches
  // the latest snapshot, but chart history is UI-local state, so we
  // still accumulate it here.
  const [powerHistory, setPowerHistory] = useState([]);

  useEffect(() => {
    if (!fleetData) return;
    const now = new Date().toLocaleTimeString();
    setPowerHistory((prev) => {
      const updated = [
        ...prev,
        { time: now, totalWatts: fleetData.aggregation.total_current_power_watts },
      ];
      return updated.slice(-20);
    });
  }, [fleetData]);

  return {
    fleetData,
    error: error ? "Could not reach backend — is the API server running?" : null,
    powerHistory,
  };
}