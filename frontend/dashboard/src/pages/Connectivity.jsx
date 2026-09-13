import { Network, ArrowRight } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

const VENDOR_LABEL = {
  generic_ups: "UPS",
  generic_pdu: "PDU",
  generic_crac: "Cooling",
};

function Connectivity() {
  const { fleetData, error } = useFleetStatus();

  return (
    <div className="pt-6 px-7 pb-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Network size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">Connectivity</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-8">
        Data flow from each device to the monitoring platform
      </p>

      {error && <p className="text-accent-red">{error}</p>}

      {fleetData && (
        <div className="flex flex-col gap-3">
          {fleetData.devices.map((device) => (
            <div
              key={device.device_id}
              className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4"
            >
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#161616] flex items-center justify-center shrink-0">
                  <Network size={15} className="text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{device.device_id}</p>
                  <p className="text-gray-500 text-[11px]">{VENDOR_LABEL[device.vendor] || device.vendor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-[11px] font-mono">Modbus TCP</span>
                <ArrowRight size={14} />
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-accent-green text-xs font-semibold">Connected</span>
              </div>

              <span className="text-gray-600 text-[11px] w-24 text-right shrink-0">
                {new Date(device.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-600 text-[11px] mt-6">
        🚧 Network topology mapping (switches, cross-connects, VLANs) is planned for a future phase —
        current view reflects telemetry data flow only.
      </p>
    </div>
  );
}

export default Connectivity;