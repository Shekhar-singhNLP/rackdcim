import { LayoutGrid, BatteryCharging, PlugZap, Wind } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";
import RadialGauge from "../components/RadialGauge";

const EXAMPLE_FACILITY_CAPACITY = 40;

const TYPE_META = {
  generic_ups: { label: "UPS", icon: BatteryCharging, color: "#f97316" },
  generic_pdu: { label: "PDU", icon: PlugZap, color: "#4ade80" },
  generic_crac: { label: "Cooling (CRAC)", icon: Wind, color: "#3b82f6" },
};

function Space() {
  const { fleetData, error } = useFleetStatus();

  const deviceCount = fleetData?.devices.length ?? 0;

  const typeCounts = {};
  fleetData?.devices.forEach((d) => {
    typeCounts[d.vendor] = (typeCounts[d.vendor] || 0) + 1;
  });

  return (
    <div className="pt-6 px-7 pb-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <LayoutGrid size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">Space</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-8">
        Rack and floor space capacity across the facility
      </p>

      {error && <p className="text-accent-red">{error}</p>}

      <div className="grid grid-cols-[1fr_1.4fr] gap-4 mb-6">
        <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center">
          <RadialGauge
            value={deviceCount}
            max={EXAMPLE_FACILITY_CAPACITY}
            label="Racks Monitored"
          />
          <p className="text-gray-600 text-[10.5px] mt-3">
            of {EXAMPLE_FACILITY_CAPACITY} racks — example facility target size
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium mb-5">Devices by Type</p>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(TYPE_META).map(([vendor, meta]) => {
              const Icon = meta.icon;
              const count = typeCounts[vendor] || 0;
              return (
                <div
                  key={vendor}
                  className="bg-[#161616] rounded-lg p-4 flex flex-col items-center text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5"
                    style={{ background: `${meta.color}1a` }}
                  >
                    <Icon size={18} color={meta.color} />
                  </div>
                  <p className="text-white text-2xl font-extrabold">{count}</p>
                  <p className="text-gray-500 text-[11px] mt-1">{meta.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border bg-[#161616]">
          <p className="text-gray-300 text-sm font-medium">Monitored Devices</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {fleetData?.devices.map((device, i) => {
              const meta = TYPE_META[device.vendor];
              const Icon = meta?.icon || LayoutGrid;
              return (
                <tr
                  key={device.device_id}
                  className={i !== fleetData.devices.length - 1 ? "border-b border-[#1a1a1a]" : ""}
                >
                  <td className="px-6 py-3.5 w-10">
                    <Icon size={16} color={meta?.color || "#888"} />
                  </td>
                  <td className="px-2 py-3.5 text-white font-medium">{device.device_id}</td>
                  <td className="px-6 py-3.5 text-gray-500">{meta?.label || device.vendor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 text-[11px]">
        🚧 Full rack-level floor mapping (cabinet layout, U-space allocation, capacity trend) is
        planned for a future phase — requires physical facility layout input, not just telemetry.
      </p>
    </div>
  );
}

export default Space;