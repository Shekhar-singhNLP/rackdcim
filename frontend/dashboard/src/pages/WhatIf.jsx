import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lightbulb } from "lucide-react";

async function fetchWhatIf(targetLoad) {
  const res = await axios.get("https://rackdcim-api.onrender.com/fleet/what-if", {
    params: { target_load: targetLoad },
  });
  return res.data;
}

function WhatIf() {
  const [targetLoad, setTargetLoad] = useState(0.5);

  const { data, isFetching } = useQuery({
    queryKey: ["whatIf", targetLoad],
    queryFn: () => fetchWhatIf(targetLoad),
    staleTime: 500,
  });

  const deviceEntries = data
    ? Object.entries(data).filter(([key]) => key.endsWith("_watts") && key !== "total_power_watts")
    : [];

  return (
    <div className="p-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Lightbulb size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">What-if Analysis</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-1">
        Minimum power required to meet a target workload — a live analog of the
        heterogeneous-machine power/DVFS-state selection problem from DATAZERO2 (IRIT Toulouse).
      </p>
      <p className="text-gray-600 text-[11px] mb-8">
        Not a reimplementation of their binary-search algorithm — a simplified
        demonstration built on real, normalized telemetry.
      </p>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-gray-400 text-sm">Target Load</span>
          <span className="text-brand font-bold text-lg">
            {(targetLoad * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={targetLoad}
          onChange={(e) => setTargetLoad(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full bg-[#1f1f1f] accent-green-500 cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-[11px] text-gray-500">
          <span>Idle (0%)</span>
          <span>Peak (100%)</span>
        </div>
      </div>

      {data && (
        <>
          <div className="bg-surface border border-border rounded-xl p-6 mb-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              Minimum Fleet Power Required{isFetching && " (updating...)"}
            </span>
            <span className="text-brand font-extrabold text-3xl transition-all duration-300">
              {data.total_power_watts.toFixed(1)} W
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {deviceEntries.map(([key, value]) => {
              const deviceId = key.replace("_watts", "");
              return (
                <div
                  key={key}
                  className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <span className="text-gray-300 text-sm font-medium">{deviceId}</span>
                  <span className="text-white font-bold">{value.toFixed(1)} W</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default WhatIf;