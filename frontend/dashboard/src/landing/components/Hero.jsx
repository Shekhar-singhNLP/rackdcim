import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 overflow-hidden">
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 text-white"
        >
          Turning Heterogeneous Power Telemetry
          <br className="hidden sm:block" /> Into One Schema.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#CBD5E0] text-sm sm:text-base mb-9 leading-relaxed max-w-md mx-auto px-2"
        >
          A vendor-agnostic normalization layer for UPS, PDU, and cooling
          infrastructure — built as real-world input for power/DVFS-state
          scheduling research.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          href="/dashboard/overview"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-[#030712] font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all"
        >
          Launch Live Simulation
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 0.6, duration: 0.5 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-1 text-gray-600"
      >
        <span className="text-[11px] tracking-wide">Scroll to explore</span>
        <ChevronDown size={16} />
      </motion.div>
    </div>
  );
}

export default Hero;