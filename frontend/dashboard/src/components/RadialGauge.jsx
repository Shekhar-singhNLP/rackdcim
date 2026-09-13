/**
 * RadialGauge — semi-circle gauge with color zones, inspired by
 * traditional DCIM capacity gauges
 **/
function RadialGauge({ value, max, label, unit = "" }) {
  const percent = Math.min(100, (value / max) * 100);
  const angle = (percent / 100) * 180;

  const radius = 70;
  const cx = 90;
  const cy = 90;

  const needleAngleRad = ((180 - angle) * Math.PI) / 180;
  const needleX = cx + radius * 0.85 * Math.cos(needleAngleRad);
  const needleY = cy - radius * 0.85 * Math.sin(needleAngleRad);

  const zoneColor = percent > 85 ? "#f87171" : percent > 60 ? "#f59e0b" : "#4ade80";

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="#1f1f1f"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke={zoneColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * 220} 220`}
          className="transition-all duration-500"
        />
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#e5e5e5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4" fill="#e5e5e5" />
      </svg>
      <p className="text-white text-2xl font-extrabold -mt-2">
        {value}
        <span className="text-gray-500 text-sm font-medium ml-1">{unit}</span>
      </p>
      <p className="text-gray-500 text-[11px] uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

export default RadialGauge;