import { motion } from "framer-motion";
import { GitMerge, SlidersHorizontal, Cpu } from "lucide-react";

const CARDS = [
  {
    icon: GitMerge,
    title: "Heterogeneous Power Aggregation",
    desc: "Normalizes power telemetry across devices into one schema.",
    status: "Live",
    color: "green",
  },
  {
    icon: SlidersHorizontal,
    title: "What-If Power Simulator",
    desc: "Model minimum fleet power at any target load, live.",
    status: "Live",
    color: "green",
  },
  {
    icon: Cpu,
    title: "Predictive DVFS Optimization",
    desc: "ML-based power/state prediction — pending production data.",
    status: "Roadmap",
    color: "gray",
  },
];

function BentoGrid() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl font-bold text-white mb-2">What's Actually Running</h2>
        <p className="text-gray-500 text-sm">No vaporware — everything marked "Live" is demoable today.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-green-500/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
              <card.icon size={18} className="text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">{card.title}</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{card.desc}</p>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                card.color === "green"
                  ? "text-green-400 bg-green-500/10"
                  : "text-gray-500 bg-white/5"
              }`}
            >
              {card.status}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default BentoGrid;