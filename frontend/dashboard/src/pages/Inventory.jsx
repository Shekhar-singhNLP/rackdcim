import { Boxes } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

const CLASS_COLOR = {
  high_performance: "text-orange-400",
  efficiency: "text-accent-green",
  baseline: "text-blue-400",
};

function Inventory() {
  const { fleetData, error } = useFleetStatus();

  return (
    <div className="pt-6 px-7 pb-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Boxes size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">Inventory</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-8">
        All registered devices across the monitored fleet
      </p>

      {error && <p className="text-accent-red">{error}</p>}
      {!error && !fleetData && <p className="text-gray-500">Loading...</p>}

      {fleetData && (
        <div className="bg-surface border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm table-fixed min-w-[800px]">
            <thead>
              <tr className="border-b border-border text-left bg-[#161616]">
                <th className="px-6 py-4 w-[20%] text-gray-500 font-medium text-xs uppercase tracking-wide">Device ID</th>
                <th className="px-6 py-4 w-[16%] text-gray-500 font-medium text-xs uppercase tracking-wide">Vendor</th>
                <th className="px-6 py-4 w-[18%] text-gray-500 font-medium text-xs uppercase tracking-wide">Model</th>
                <th className="px-6 py-4 w-[18%] text-gray-500 font-medium text-xs uppercase tracking-wide">Machine Class</th>
                <th className="px-6 py-4 w-[14%] text-gray-500 font-medium text-xs uppercase tracking-wide">Power</th>
                <th className="px-6 py-4 w-[14%] text-gray-500 font-medium text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleetData.devices.map((device, i) => (
                <tr
                  key={device.device_id}
                  className={`${i !== fleetData.devices.length - 1 ? "border-b border-[#1a1a1a]" : ""} hover:bg-[#161616] transition-colors`}
                >
                  <td className="px-6 py-4 text-white font-medium truncate">{device.device_id}</td>
                  <td className="px-6 py-4 text-gray-400 truncate">{device.vendor}</td>
                  <td className="px-6 py-4 text-gray-400 truncate">{device.model}</td>
                  <td className={`px-6 py-4 font-medium truncate ${CLASS_COLOR[device.machine_class] || "text-gray-400"}`}>
                    {device.machine_class}
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-semibold">
                    {device.real_power_watts.toFixed(1)} W
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        device.on_battery
                          ? "bg-red-500/10 text-accent-red"
                          : "bg-green-500/10 text-accent-green"
                      }`}
                    >
                      {device.on_battery ? "On Battery" : "Normal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fleetData && (
        <p className="text-gray-600 text-xs mt-4">
          Showing {fleetData.devices.length} of {fleetData.devices.length} devices
        </p>
      )}
    </div>
  );
}

export default Inventory;