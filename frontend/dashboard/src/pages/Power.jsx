import { Zap } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

function Power() {
  const { fleetData, error } = useFleetStatus();

  return (
    <div className="p-7 h-full overflow-y-auto">
      <h1 className="text-white text-xl font-bold">Power</h1>
      <p className="text-gray-500 text-[12.5px] mt-1 mb-6">
        Budget capacity and per-device power draw
      </p>

      {error && <p className="text-accent-red">{error}</p>}
      {!error && !fleetData && <p className="text-gray-500">Loading...</p>}

      {fleetData && (
        <div className="flex flex-col gap-4">
          {fleetData.devices.map((device) => {
            const { min_watts, max_watts } = device.power_budget;
            const hasRange = min_watts != null && max_watts != null;
            const percentUsed = hasRange
              ? Math.min(
                  100,
                  ((device.real_power_watts - min_watts) / (max_watts - min_watts)) * 100
                )
              : 0;

            const barColor =
              percentUsed > 85 ? "bg-accent-red" : percentUsed > 60 ? "bg-orange-500" : "bg-accent-green";

            return (
              <div
                key={device.device_id}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Zap size={16} className="text-brand" />
                    <span className="text-white font-semibold text-sm">{device.device_id}</span>
                    <span className="text-gray-500 text-xs">· {device.machine_class}</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {device.real_power_watts.toFixed(1)} W
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500`}
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2 text-[11px] text-gray-500">
                  <span>{hasRange ? `${min_watts}W min` : "—"}</span>
                  <span>{percentUsed.toFixed(0)}% of budget range</span>
                  <span>{hasRange ? `${max_watts}W max` : "—"}</span>
                </div>
              </div>
            );
          })}

          <div className="mt-2 bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Fleet Power</span>
            <span className="text-brand font-extrabold text-2xl">
              {fleetData.aggregation.total_current_power_watts.toFixed(1)} W
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Power;