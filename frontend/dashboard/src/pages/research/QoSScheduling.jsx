import { Target } from "lucide-react";
import BinarySearchVisualizer from "../../components/BinarySearchVisualizer";

function QoSScheduling() {
  return (
    <div className="p-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Target size={18} className="text-cyan-400" />
        <h1 className="text-white text-xl font-bold">QoS-Constrained Power Scheduling</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-6">
        Based on: DATAZERO2, IRIT Toulouse (Pierson, Da Costa, Stolf)
      </p>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">The Problem</h3>
        <p className="text-[#CBD5E0] text-sm leading-relaxed">
          Given a performance target you must meet (a "Quality of Service" level —
          for example, "run at least 60% of full speed"), what is the{" "}
          <strong className="text-white">lowest possible power</strong> that still
          meets it? Checking every possible speed one by one works, but is slow.
          Instead, we can exploit one fact: power only ever goes up as speed goes
          up — it never dips back down. That "always increasing" property is what
          makes binary search possible.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">Why it matters for RackDCIM</h3>
        <p className="text-[#CBD5E0] text-sm leading-relaxed">
          Instead of scanning every operating point, the search narrows the range
          in half at each step — reaching an answer in roughly 8 steps instead of
          hundreds. This is the same efficiency principle DATAZERO2 applies when
          selecting power states across a whole fleet of different machines.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-white font-semibold text-sm mb-1">Live Search</h3>
        <p className="text-gray-500 text-[11px] mb-4">Drag the slider to set a QoS target and watch it converge.</p>
        <BinarySearchVisualizer machineClass="high_performance" />
      </div>
      <p className="text-center text-[#A0AEC0] text-[11px] mt-4">
        Simplified illustrative model — not yet affiliated with or endorsed by the referenced lab.
      </p>
    </div>
  );
}

export default QoSScheduling;