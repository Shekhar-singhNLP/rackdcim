import DeviceCard from "../components/DeviceCard";
import PowerTrendChart from "../components/PowerTrendChart";
import { useFleetStatus } from "../hooks/useFleetStatus";

function EnterpriseOverview() {
  const { fleetData, error, powerHistory } = useFleetStatus();

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.headerRow}>
        <div>
          <h1 style={pageStyles.heading}>Enterprise Overview</h1>
          <p style={pageStyles.subheading}>Live telemetry · refreshed every 3s</p>
        </div>
        {fleetData && (
          <div style={pageStyles.aggregationCompact}>
            <span style={pageStyles.aggLabel}>Total Fleet Power</span>
            <span style={pageStyles.aggValue}>
              {fleetData.aggregation.total_current_power_watts.toFixed(1)} W
            </span>
          </div>
        )}
      </div>

      {error && <p style={pageStyles.error}>{error}</p>}
      {!error && !fleetData && <p style={pageStyles.loading}>Loading...</p>}

      {fleetData && (
        <div style={pageStyles.grid}>
          <div style={pageStyles.cardRow}>
            {fleetData.devices.map((device) => (
              <DeviceCard key={device.device_id} device={device} />
            ))}
          </div>
          <PowerTrendChart history={powerHistory} />
        </div>
      )}
    </div>
  );
}

const pageStyles = {
  container: { padding: "22px 28px", height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  heading: { color: "#fff", margin: 0, fontSize: "20px", fontWeight: 700 },
  subheading: { color: "#666", marginTop: "3px", fontSize: "12.5px" },
  grid: { display: "flex", flexDirection: "column", gap: "14px" },
  cardRow: { display: "flex", gap: "14px" },
  aggregationCompact: {
    padding: "10px 20px", background: "#131313", borderRadius: "10px",
    border: "1px solid #232323", display: "flex", gap: "10px", alignItems: "baseline",
  },
  aggLabel: { color: "#777", fontSize: "11.5px" },
  aggValue: { color: "#4ade80", fontSize: "19px", fontWeight: 800 },
  error: { color: "#f87171" },
  loading: { color: "#888" },
};

export default EnterpriseOverview;