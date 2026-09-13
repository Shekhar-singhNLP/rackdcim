import { motion } from "framer-motion";
import { Cloud, Server, Check } from "lucide-react";

const MODELS = [
  {
    icon: Cloud,
    title: "Cloud-Hosted (SaaS)",
    subtitle: "We manage everything. You just log in.",
    color: "green",
    points: [
      "No infrastructure to maintain",
      "Automatic updates and monitoring",
      "Fastest path from install to dashboard",
      "Ideal for single-facility pilots",
    ],
  },
  {
    icon: Server,
    title: "On-Premise (Self-Hosted)",
    subtitle: "Runs on your infrastructure. Your data never leaves your building.",
    color: "blue",
    points: [
      "Telemetry never transmitted externally",
      "Full control over update schedule",
      "Meets data-sovereignty requirements",
      "Suited for regulated or security-conscious operators",
    ],
  },
];

const colorMap = {
  green: {
    icon: "text-green-400",
    iconBg: "bg-green-500/10",
    border: "hover:border-green-500/30",
    check: "text-green-400",
  },
  blue: {
    icon: "text-blue-400",
    iconBg: "bg-blue-500/10",
    border: "hover:border-blue-500/30",
    check: "text-blue-400",
  },
};

function DeploymentModels() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Deploy It Your Way</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            The same platform, two deployment models — chosen based on what your facility
            actually needs, not a one-size-fits-all default.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MODELS.map((model, i) => {
            const c = colorMap[model.color];
            return (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 ${c.border} transition-colors`}
              >
                <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center mb-6`}>
                  <model.icon size={22} className={c.icon} />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{model.title}</h3>
                <p className="text-gray-500 text-sm mb-6">{model.subtitle}</p>

                <div className="flex flex-col gap-3">
                  {model.points.map((point) => (
                    <div key={point} className="flex items-start gap-2.5">
                      <Check size={15} className={`${c.check} mt-0.5 shrink-0`} />
                      <span className="text-gray-400 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DeploymentModels;