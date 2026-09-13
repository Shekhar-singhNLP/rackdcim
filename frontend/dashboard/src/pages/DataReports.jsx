import { FileBarChart, Download, FileText, BarChart3, Zap } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

const REPORT_TEMPLATES = [
  {
    key: "power-summary",
    label: "Power Summary Report",
    description: "Per-device power draw, fleet totals, and machine-class breakdown",
    icon: Zap,
    color: "#4ade80",
  },
  {
    key: "inventory-export",
    label: "Inventory Export",
    description: "Full device list — vendor, model, class, current status",
    icon: FileText,
    color: "#3b82f6",
  },
  {
    key: "capacity-trend",
    label: "Capacity Trend Report",
    description: "Historical power/load trend over a selected date range",
    icon: BarChart3,
    color: "#f97316",
  },
];

function DataReports() {
  const { fleetData } = useFleetStatus();

  return (
    <div className="pt-6 px-7 pb-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <FileBarChart size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">Data Reports</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-8">
        Exportable reports across power, inventory, and capacity data
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {REPORT_TEMPLATES.map(({ key, label, description, icon: Icon, color }) => (
          <div key={key} className="bg-surface border border-border rounded-xl p-5 flex flex-col">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
              style={{ background: `${color}1a` }}
            >
              <Icon size={16} color={color} />
            </div>
            <p className="text-white text-sm font-semibold mb-1.5">{label}</p>
            <p className="text-gray-500 text-[11.5px] leading-relaxed flex-1">{description}</p>
            <button
              disabled
              className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#161616] text-gray-600 text-xs font-medium cursor-not-allowed"
            >
              <Download size={13} />
              Coming Soon
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-[#161616]">
          <p className="text-gray-300 text-sm font-medium">Live Data Snapshot</p>
          <p className="text-gray-600 text-[11px] mt-0.5">
            Current fleet state — the raw data these reports would be generated from
          </p>
        </div>

        {fleetData && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-gray-500 font-medium text-[11px] uppercase tracking-wide">Device</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-[11px] uppercase tracking-wide">Power (W)</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-[11px] uppercase tracking-wide">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {fleetData.devices.map((device, i) => (
                <tr
                  key={device.device_id}
                  className={i !== fleetData.devices.length - 1 ? "border-b border-[#1a1a1a]" : ""}
                >
                  <td className="px-6 py-3 text-white font-medium">{device.device_id}</td>
                  <td className="px-6 py-3 text-gray-400">{device.real_power_watts.toFixed(1)}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">
                    {new Date(device.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-gray-600 text-[11px] mt-6">
        🚧 PDF/CSV export and scheduled report delivery planned for a future phase — the "Live Data
        Snapshot" above shows the underlying data these reports will be built from.
      </p>
    </div>
  );
}

export default DataReports;