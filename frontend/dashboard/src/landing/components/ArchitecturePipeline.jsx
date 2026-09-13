import { motion } from "framer-motion";
import { Router, Layers, LineChart, ArrowRight } from "lucide-react";

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
    <section id="architecture" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-3">From Electrical Signals to Insight</h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">
            One pipeline, three stages — designed to work identically whether the source is a
            simulated fleet or a real facility.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex-1 flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-green-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <step.icon size={18} className="text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{step.description}</p>
              </motion.div>

              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                  className="hidden md:block shrink-0"
                >
                  <ArrowRight size={18} className="text-gray-700" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchitecturePipeline;