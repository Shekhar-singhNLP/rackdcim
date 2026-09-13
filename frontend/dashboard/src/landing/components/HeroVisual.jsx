import { motion } from "framer-motion";
import { Zap, Server, Wind, Cpu } from "lucide-react";

const NODES = [
  { icon: Server, label: "UPS", angle: -60, delay: 0 },
  { icon: Zap, label: "PDU", angle: -20, delay: 0.15 },
  { icon: Wind, label: "CRAC", angle: 20, delay: 0.3 },
  { icon: Cpu, label: "Gateway", angle: 60, delay: 0.45 },
];

function HeroVisual() {
  return (
    <div className="relative w-full h-[280px] flex items-center justify-center">
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280">
        {NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x2 = 200 + 140 * Math.sin(rad);
          const y2 = 140 - 80 * Math.cos(rad);
          return (
            <motion.line
              key={node.label}
              x1="200"
              y1="140"
              x2={x2}
              y2={y2}
              stroke="#22d3ee"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: node.delay, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* Center core node */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center"
        style={{ boxShadow: "0 0 40px rgba(34,211,238,0.25)" }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 rounded-full bg-cyan-400"
        />
      </motion.div>

      {/* Satellite nodes */}
      {NODES.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = 140 * Math.sin(rad);
        const y = -80 * Math.cos(rad);
        return (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: node.delay + 0.3 }}
            className="absolute flex flex-col items-center gap-1.5"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <node.icon size={15} className="text-gray-400" />
            </div>
            <span className="text-[10px] text-gray-600">{node.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default HeroVisual;