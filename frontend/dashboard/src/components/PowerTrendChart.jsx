import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function PowerTrendChart({ history }) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Total Actual Active Power</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={history}>
          <defs>
            <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
          <XAxis dataKey="time" stroke="#555" fontSize={11} tickLine={false} />
          <YAxis stroke="#555" fontSize={11} unit="W" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "8px" }}
            labelStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="totalWatts"
            stroke="#4ade80"
            strokeWidth={2}
            fill="url(#powerGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#131313",
    borderRadius: "10px",
    border: "1px solid #232323",
    padding: "18px 20px",
    flex: 1,
  },
  title: { color: "#fff", margin: "0 0 10px 0", fontSize: "13.5px", fontWeight: 600 },
};

export default PowerTrendChart;