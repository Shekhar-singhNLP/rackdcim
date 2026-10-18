import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Dot, ResponsiveContainer,
} from "recharts";

const API_URL = "https://rackdcim-api.onrender.com";
//const API_URL = "http://localhost:5173/";

const CLASS_COLOR = { high_performance: "#f97316", efficiency: "#22c55e", baseline: "#3b82f6" };

async function fetchDVFSStates(machineClass) {
  const res = await axios.get(`${API_URL}/dvfs/${machineClass}`);
  return res.data.states;
}

function CustomDot(props) {
  const { cx, cy, payload, color } = props;
  return (
    <g>
      <Dot cx={cx} cy={cy} r={4} fill={color} />
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#888" fontSize={10}>
        {payload.label}
      </text>
    </g>
  );
}

function DVFSCurveChart({ machineClass }) {
  const { data: states, isLoading } = useQuery({
    queryKey: ["dvfsStates", machineClass],
    queryFn: () => fetchDVFSStates(machineClass),
    staleTime: Infinity, // DVFS curve is deterministic math, not live telemetry — no need to refetch
  });

  const color = CLASS_COLOR[machineClass] || "#888";

  if (isLoading || !states) {
    return <div className="h-[220px] flex items-center justify-center text-gray-600 text-sm">Loading curve...</div>;
  }

  return (
    <div>
      <p className="text-gray-500 text-[11px] mb-2">
        P(f) = P<sub>ref</sub> · (f / f<sub>ref</sub>)³ — cubic dynamic-power scaling, per{" "}
        <span className="text-cyan-400">Da Costa &amp; Stolf (2025)</span>
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={states} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
          <XAxis
            dataKey="frequency_ghz"
            stroke="#666"
            fontSize={11}
            label={{ value: "Frequency (GHz)", position: "insideBottom", offset: -5, fill: "#666", fontSize: 11 }}
          />
          <YAxis
            stroke="#666"
            fontSize={11}
            label={{ value: "Power (W)", angle: -90, position: "insideLeft", fill: "#666", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "8px" }}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => [`${value} W`, "Power"]}
            labelFormatter={(freq) => `${freq} GHz`}
          />
          <Line
            type="monotone"
            dataKey="power_watts"
            stroke={color}
            strokeWidth={2}
            dot={<CustomDot color={color} />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DVFSCurveChart;