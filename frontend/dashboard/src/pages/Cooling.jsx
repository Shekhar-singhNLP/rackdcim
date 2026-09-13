import { Wind, Thermometer, CheckCircle2, AlertTriangle } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

// ASHRAE recommended thermal envelope for data center equipment (industry standard)
const ASHRAE_MIN = 18;
const ASHRAE_MAX = 27;

function Cooling() {
  const { fleetData, error } = useFleetStatus();

  const coolingDevices = fleetData?.devices.filter((d) => d.vendor === "generic_crac") ?? [];

  return (
    <div className="pt-6 px-7 pb-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Wind size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">Cooling</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-8">
        Thermal monitoring across CRAC/CRAH units
      </p>

      {error && <p className="text-accent-red">{error}</p>}

      {coolingDevices.length === 0 && (
        <p className="text-gray-600 text-sm">No cooling units currently monitored.</p>
      )}

      {coolingDevices.length > 0 && (
        <div className="flex flex-col gap-3">
          {coolingDevices.map((device) => {
            const temp = device.internal_temperature;
            const inRange = temp >= ASHRAE_MIN && temp <= ASHRAE_MAX;
            const rangeSpan = ASHRAE_MAX - ASHRAE_MIN + 10; // padding for visual scale
            const scaleMin = ASHRAE_MIN - 5;
            const posPercent = Math.min(100, Math.max(0, ((temp - scaleMin) / rangeSpan) * 100));
            const zoneStartPercent = ((ASHRAE_MIN - scaleMin) / rangeSpan) * 100;
            const zoneWidthPercent = ((ASHRAE_MAX - ASHRAE_MIN) / rangeSpan) * 100;

            return (
              <div key={device.device_id} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Wind size={18} color="#3b82f6" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{device.device_id}</p>
                      <p className="text-gray-500 text-[11px]">{device.model} · {device.machine_class}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-gray-500 text-[10.5px] uppercase tracking-wide">Power</p>
                      <p className="text-white font-bold text-sm">{device.real_power_watts.toFixed(1)} W</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-[10.5px] uppercase tracking-wide">Temperature</p>
                      <p className="text-white font-bold text-2xl">{temp.toFixed(1)}°C</p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        inRange ? "bg-green-500/10 text-accent-green" : "bg-red-500/10 text-accent-red"
                      }`}
                    >
                      {inRange ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                      {inRange ? "Within ASHRAE Range" : "Out of Range"}
                    </div>
                  </div>
                </div>

                <div className="relative h-2 bg-[#1f1f1f] rounded-full">
                  <div
                    className="absolute h-full bg-green-500/25 rounded-full"
                    style={{ left: `${zoneStartPercent}%`, width: `${zoneWidthPercent}%` }}
                  />
                  <div
                    className="absolute w-3 h-3 rounded-full bg-white border-2 border-[#0a0a0a] -top-0.5 transition-all duration-500"
                    style={{ left: `calc(${posPercent}% - 6px)` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10.5px] text-gray-600">
                  <span>{ASHRAE_MIN - 5}°C</span>
                  <span className="text-gray-500">ASHRAE recommended: {ASHRAE_MIN}–{ASHRAE_MAX}°C</span>
                  <span>{ASHRAE_MAX + 5}°C</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-gray-600 text-[11px] mt-6">
        🚧 Supply/return air differential and airflow (CFM) tracking planned for a future phase —
        requires additional sensor points beyond current CRAC power telemetry.
      </p>
    </div>
  );
}

export default Cooling;