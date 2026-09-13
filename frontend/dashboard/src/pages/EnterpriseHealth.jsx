import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

function EnterpriseHealth() {
  const { fleetData, error } = useFleetStatus();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Enterprise Health</h1>
      <p style={styles.subheading}>Site-wide device health · refreshed every 3s</p>

      {error && <p style={styles.error}>{error}</p>}
      {!error && !fleetData && <p style={styles.loading}>Loading...</p>}

      {fleetData && (
        <div style={styles.tileGrid}>
          {fleetData.devices.map((device, index) => {
            const isHealthy = !device.on_battery && !device.battery_low;
            return (
              <motion.div
                key={device.device_id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                style={{
                  ...styles.tile,
                  background: isHealthy
                    ? "linear-gradient(135deg, #0d2818 0%, #0a0a0a 100%)"
                    : "linear-gradient(135deg, #2e1010 0%, #0a0a0a 100%)",
                  border: `1px solid ${isHealthy ? "#1f4a30" : "#5c2323"}`,
                }}
              >
                <div style={styles.tileHeader}>
                  {isHealthy ? (
                    <CheckCircle2 size={20} color="#3ee08c" />
                  ) : (
                    <AlertTriangle size={20} color="#f87171" />
                  )}
                  <span style={styles.tileTitle}>{device.device_id}</span>
                </div>

                <p style={styles.tileStat}>{device.real_power_watts.toFixed(1)} W</p>
                <p style={styles.tileClass}>{device.machine_class}</p>

                <div style={styles.metaGrid}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Temp</span>
                    <span style={styles.metaValue}>{device.internal_temperature.toFixed(1)}°C</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Adds</span>
                    <span style={styles.metaValue}>0</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Decoms</span>
                    <span style={styles.metaValue}>0</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Events</span>
                    <span style={styles.metaValue}>{isHealthy ? 0 : 1}</span>
                  </div>
                </div>

                <p style={{ ...styles.tileStatus, color: isHealthy ? "#3ee08c" : "#f87171" }}>
                  {isHealthy ? "Healthy" : "Needs Attention"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "22px 28px" },
  heading: { color: "#fff", margin: 0, fontSize: "20px", fontWeight: 700 },
  subheading: { color: "#666", marginTop: "3px", marginBottom: "24px", fontSize: "12.5px" },
  tileGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" },
  tile: { borderRadius: "14px", padding: "22px 24px" },
  tileHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" },
  tileTitle: { color: "#fff", fontSize: "16px", fontWeight: 700 },
  tileStat: { color: "#fff", fontSize: "34px", fontWeight: 800, margin: "0 0 2px 0" },
  tileClass: { color: "#999", fontSize: "12.5px", margin: "0 0 16px 0" },
  metaGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px", marginBottom: "16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "12px 0",
  },
  metaItem: { display: "flex", flexDirection: "column", gap: "3px" },
  metaLabel: { color: "#777", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" },
  metaValue: { color: "#e5e5e5", fontSize: "13px", fontWeight: 700 },
  tileStatus: { fontSize: "13px", fontWeight: 700, margin: 0 },
  error: { color: "#f87171" },
  loading: { color: "#888" },
};

export default EnterpriseHealth;