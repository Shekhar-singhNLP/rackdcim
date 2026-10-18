import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

const API_URL = "https://rackdcim-api.onrender.com";

async function fetchMarketplace() {
  const res = await axios.get(`${API_URL}/marketplace/compare`);
  return res.data;
}

const COLORS = ["#f97316", "#22d3ee"];

function MarketplaceComparisonChart() {
  const { data } = useQuery({
    queryKey: ["marketplaceCompare"],
    queryFn: fetchMarketplace,
    placeholderData: (prev) => prev,
  });

  if (!data) return <div className="text-gray-500 text-sm">Loading...</div>;

  const chartData = [
    { name: "Non-Cooperative", backup: data.non_cooperative.total_backup_watts },
    { name: "Cooperative", backup: data.cooperative.total_backup_watts },
  ];

  return (
    <div>
      <p className="text-cyan-400 text-sm mb-4">
        Cooperation saves {data.backup_power_saved_watts} W of backup power across the sample sites.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis
              stroke="#666"
              fontSize={12}
              label={{ value: "Watts", angle: -90, position: "insideLeft", fill: "#666", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="backup" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MarketplaceComparisonChart;