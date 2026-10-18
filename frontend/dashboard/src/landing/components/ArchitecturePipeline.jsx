import { motion } from "framer-motion";
import { Router, Layers, LineChart, ArrowRight, ArrowDown } from "lucide-react";

const STEPS = [
  {
    icon: Router,
    title: "Edge Gateway",
    description: "Polls UPS, PDU, and cooling units over Modbus TCP/RTU — vendor-agnostic by design.",
  },
  {
    icon: Layers,
    title: "Normalization Engine",
    description: "Converts any vendor's raw registers into one unified telemetry schema.",
  },
  {
    icon: LineChart,
    title: "Live Dashboard",
    description: "Real-time power, health, and DVFS-state analysis — no vendor lock-in.",
  },
];

function ArchitecturePipeline() {
  return (
    <section id="architecture" className="relative min-h-[70vh] flex flex-col items-center justify-center px-5 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-16"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">From Electrical Signals to Insight</h2>
        <p className="text-[#A0AEC0] text-sm max-w-xl mx-auto px-2">
          One pipeline, three stages — designed to work identically whether the source is a
          simulated fleet or a real facility.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-stretch gap-4 max-w-5xl w-full">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex flex-col md:flex-row flex-1 items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex-1 w-full rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-7 hover:border-green-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <step.icon size={18} className="text-green-400" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-[#CBD5E0] text-sm leading-relaxed">{step.description}</p>
            </motion.div>

            {i < STEPS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                className="shrink-0"
              >
                <ArrowDown size={18} className="text-gray-700 md:hidden" />
                <ArrowRight size={18} className="text-gray-700 hidden md:block" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ArchitecturePipeline;