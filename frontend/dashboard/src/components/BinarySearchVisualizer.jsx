import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "https://rackdcim-api.onrender.com";

async function fetchBinarySearch(machineClass, targetRatio) {
  const res = await axios.get(`${API_URL}/scheduler/binary-search`, {
    params: { machine_class: machineClass, target_ratio: targetRatio },
  });
  return res.data;
}

function BinarySearchVisualizer({ machineClass = "high_performance" }) {
  const [targetRatio, setTargetRatio] = useState(0.6);

  const { data } = useQuery({
    queryKey: ["binarySearch", machineClass, targetRatio],
    queryFn: () => fetchBinarySearch(machineClass, targetRatio),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-gray-400 text-sm">QoS Target (frequency ratio)</span>
        <span className="text-cyan-400 font-bold text-lg">{(targetRatio * 100).toFixed(0)}%</span>
      </div>
      <input
        type="range"
        min="0.05"
        max="0.95"
        step="0.05"
        value={targetRatio}
        onChange={(e) => setTargetRatio(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full bg-[#1f1f1f] accent-cyan-500 cursor-pointer mb-6"
      />

      {data && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#161616] rounded-lg p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase mb-1">Converged Frequency</p>
              <p className="text-white font-bold text-lg">{data.found_frequency_ghz} GHz</p>
            </div>
            <div className="bg-[#161616] rounded-lg p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase mb-1">Minimum Power</p>
              <p className="text-cyan-400 font-bold text-lg">{data.found_power_watts} W</p>
            </div>
            <div className="bg-[#161616] rounded-lg p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase mb-1">Iterations</p>
              <p className="text-white font-bold text-lg">{data.iterations}</p>
            </div>
          </div>

          <p className="text-gray-500 text-[11px] mb-3">
            Convergence trace — each step halves the search range (O(log n)):
          </p>
          <div className="flex flex-col gap-1.5">
            {data.convergence_trace.map((step, i) => {
              const rangeWidth = step.high - step.low;
              const maxRange = data.convergence_trace[0].high - data.convergence_trace[0].low;
              const widthPercent = (rangeWidth / maxRange) * 100;
              return (
                <motion.div
                  key={step.iteration}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-gray-600 text-[10px] w-4">{step.iteration}</span>
                  <div className="flex-1 h-4 bg-[#1a1a1a] rounded relative overflow-hidden">
                    <div
                      className="h-full bg-cyan-500/30 rounded transition-all"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-[10px] font-mono w-32">
                    [{step.low.toFixed(3)}, {step.high.toFixed(3)}]
                  </span>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default BinarySearchVisualizer;