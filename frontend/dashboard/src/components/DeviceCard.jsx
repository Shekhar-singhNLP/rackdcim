import { BatteryCharging, PlugZap, Wind } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

const ICON_MAP = { generic_ups: BatteryCharging, generic_pdu: PlugZap, generic_crac: Wind };
const CLASS_COLOR = { high_performance: "#f97316", efficiency: "#22c55e", baseline: "#3b82f6" };

function DeviceCard({ device }) {
  const { selectedDeviceId, setSelectedDeviceId } = useAppStore();
  const isSelected = selectedDeviceId === device.device_id;
  const Icon = ICON_MAP[device.vendor] || PlugZap;
  const accent = CLASS_COLOR[device.machine_class] || "#666";

  return (
    <div
      onClick={() => setSelectedDeviceId(device.device_id)}
      style={{
        ...styles.card,
        borderTop: `2px solid ${accent}`,
        outline: isSelected ? `2px solid ${accent}` : "none",
        cursor: "pointer",
      }}
    >
      <div style={styles.headerRow}>
        <div style={styles.iconBox}>
          <Icon size={16} color={accent} />
        </div>
        <div>
          <h3 style={styles.title}>{device.device_id}</h3>
          <p style={styles.subtitle}>{device.vendor} · {device.model}</p>
        </div>
      </div>

      <div style={styles.powerRow}>
        <span style={styles.powerValue}>{device.real_power_watts.toFixed(1)}</span>
        <span style={styles.powerUnit}>W</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Voltage (in/out)</span>
        <span style={styles.value}>
          {device.input_voltage.toFixed(1)}V / {device.output_voltage.toFixed(1)}V
        </span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Machine Class</span>
        <span style={{ ...styles.value, color: accent }}>{device.machine_class}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Status</span>
        <span style={device.on_battery ? styles.statusWarning : styles.statusOk}>
          {device.on_battery ? "On Battery" : "Normal"}
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#131313",
    borderRadius: "10px",
    padding: "16px 18px",
    flex: 1,
    border: "1px solid #232323",
    borderBottomWidth: "1px",
  },
  headerRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
  iconBox: {
    width: "32px", height: "32px", borderRadius: "8px",
    background: "#1a1a1a", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  title: { margin: 0, fontSize: "14.5px", color: "#fff", fontWeight: 600 },
  subtitle: { margin: "1px 0 0 0", fontSize: "11px", color: "#666" },
  powerRow: { display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "14px" },
  powerValue: { fontSize: "30px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" },
  powerUnit: { fontSize: "13px", color: "#666", fontWeight: 600 },
  row: {
    display: "flex", justifyContent: "space-between",
    padding: "7px 0", borderTop: "1px solid #1f1f1f", fontSize: "12.5px",
  },
  label: { color: "#777" },
  value: { color: "#e5e5e5", fontWeight: 600 },
  statusOk: { color: "#4ade80", fontWeight: 600 },
  statusWarning: { color: "#f87171", fontWeight: 600 },
};

export default DeviceCard;