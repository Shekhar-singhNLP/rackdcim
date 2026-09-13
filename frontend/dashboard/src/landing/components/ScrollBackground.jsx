function ScrollBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="drift-glow drift-glow-1" />
      <div className="drift-glow drift-glow-2" />
      <div className="absolute inset-0 opacity-[0.35]">
        <div className="trace-line-v" style={{ left: "15%", animationDelay: "0s" }} />
        <div className="trace-line-v" style={{ left: "50%", animationDelay: "2.5s" }} />
        <div className="trace-line-v" style={{ left: "82%", animationDelay: "4.5s" }} />
        <div className="trace-line-h" style={{ top: "25%", animationDelay: "1s" }} />
        <div className="trace-line-h" style={{ top: "65%", animationDelay: "3.5s" }} />
      </div>
    </div>
  );
}

export default ScrollBackground;