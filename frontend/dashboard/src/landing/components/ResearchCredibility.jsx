import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

const PAPERS = [
  {
    title: "Assessing Power Needs to Run a Workload with Quality of Service on Green Datacenters",
    source: "DATAZERO2 Project — IRIT Toulouse (Da Costa, Stolf)",
    note: "Studied for its heterogeneous machine / power-state selection problem — directly informs RackDCIM's power aggregation and What-If simulator.",
    url: "https://link.springer.com/chapter/10.1007/978-3-031-39698-4_16",
  },
];

function ResearchCredibility() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-gray-400 text-xs font-medium mb-6">
            <BookOpen size={13} />
            Research-Grounded, Not Just Engineered
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Built on Published Research</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            RackDCIM's architecture wasn't designed in a vacuum — the following academic work
            was studied and credited in its making.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
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
              className="group rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-semibold text-sm mb-1.5 leading-snug">{paper.title}</p>
                  <p className="text-green-400 text-xs font-medium mb-3">{paper.source}</p>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{paper.note}</p>
                </div>
                <ExternalLink
                  size={16}
                  className="text-gray-600 group-hover:text-green-400 transition-colors shrink-0 mt-1"
                />
              </div>
            </motion.a>
          ))}
        </div>

        <p className="text-center text-gray-700 text-[11px] mt-8">
          RackDCIM is an independent project and is not affiliated with or endorsed by IRIT Toulouse.
        </p>
      </div>
    </section>
  );
}

export default ResearchCredibility;