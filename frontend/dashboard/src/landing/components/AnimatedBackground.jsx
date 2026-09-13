function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      {/* Faint noise texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Pulsing orbs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slower" />

      {/* Trace lines */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.12]">
        <div className="trace-line-v" style={{ left: "18%", animationDelay: "0s" }} />
        <div className="trace-line-v" style={{ left: "62%", animationDelay: "3s" }} />
        <div className="trace-line-h" style={{ top: "30%", animationDelay: "1.5s" }} />
        <div className="trace-line-h" style={{ top: "70%", animationDelay: "4s" }} />
      </div>
    </div>
  );
}

export default AnimatedBackground;