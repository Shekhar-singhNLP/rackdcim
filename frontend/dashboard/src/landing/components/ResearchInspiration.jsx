import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

const PAPERS = [
  {
    title: "Assessing Power Needs to Run a Workload with Quality of Service on Green Datacenters",
    source: "DATAZERO2 Project — IRIT Toulouse (Pierson, Da Costa, Stolf)",
    note: "The foundational framing for our power aggregation and What-If simulator — the heterogeneous machine/power-state selection problem.",
    url: "https://link.springer.com/chapter/10.1007/978-3-031-39698-4_16",
  },
  {
    title: "Hardware and Application Aware Performance, Power and Energy Models for Modern HPC Servers with DVFS",
    source: "Sustainable Computing: Informatics and Systems, 2025 (Da Costa, Stolf et al.)",
    note: "Directly informs how we model DVFS-state behavior per machine class in the dashboard.",
    url: "https://doi.org/10.1016/j.suscom.2025.101106",
  },
  {
    title: "Cooperative vs. Non-Cooperative Marketplace for Computing Jobs on Geo-Distributed Data Centers Powered by Renewable Energy",
    source: "Cluster Computing, 2025 (Da Costa, Stolf et al.)",
    note: "Shaped our thinking on how normalized telemetry could feed multi-site, heterogeneous scheduling decisions.",
    url: "https://doi.org/10.1007/s10586-025-05300-5",
  },
];

function ResearchInspiration() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-5 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[#CBD5E0] text-xs font-medium mb-6">
          <BookOpen size={13} />
          Research-Grounded, Not Just Engineered
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Inspired by Research</h2>
        <p className="text-[#A0AEC0] text-sm max-w-xl mx-auto px-2">
          This project studies published work on datacenter power and scheduling —
          not just one paper, but an ongoing line of research.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 max-w-2xl w-full">
        {PAPERS.map((paper, i) => (
          <motion.a
            key={paper.title}
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-7 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-[15px] mb-2 leading-snug">{paper.title}</p>
                <p className="text-cyan-400 text-xs font-semibold mb-3">{paper.source}</p>
                <p className="text-[#CBD5E0] text-sm leading-relaxed">{paper.note}</p>
              </div>
              <ExternalLink
                size={16}
                className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1"
              />
            </div>
          </motion.a>
        ))}
      </div>

      <p className="text-center text-[#A0AEC0] text-[12px] mt-8 px-4">
        RackDCIM is an independent project and is not affiliated with or endorsed by these labs.
      </p>
    </section>
  );
}

export default ResearchInspiration;