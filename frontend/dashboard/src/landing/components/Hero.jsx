import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Aurora gradient mesh - slow morphing, pure CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div className="relative z-10 max-w-2xl text-center pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 text-white"
        >
          DCIM built for small colocation
          <br />and edge data centers.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-300 text-sm mb-9 leading-relaxed max-w-md mx-auto"
        >
          Vendor-agnostic monitoring for UPS, PDU, and cooling infrastructure.
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

    </div>
  );
}

export default Hero;