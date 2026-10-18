import { Cpu } from "lucide-react";
import DVFSCurveChart from "../../components/DVFSCurveChart";

function DVFSAnalysis() {
  return (
    <div className="p-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Cpu size={18} className="text-cyan-400" />
        <h1 className="text-white text-xl font-bold">DVFS Power Modeling</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-6">
        Based on: Da Costa & Stolf (2025), DVFS Power Models for HPC Servers
      </p>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">What is DVFS?</h3>
        <p className="text-[#CBD5E0] text-sm leading-relaxed mb-4">
          DVFS (Dynamic Voltage and Frequency Scaling) is how a processor adjusts
          its own speed to save power — the same idea as your laptop switching
          between "battery saver" and "high performance" mode. Slower speed uses
          much less power; faster speed uses much more.
        </p>
        <p className="text-[#CBD5E0] text-sm leading-relaxed">
          The key detail: power does not scale in a straight line with speed —
          it scales roughly with the <strong className="text-white">cube</strong> of
          frequency. Push a chip just 20% faster, and power draw can jump by 70%
          or more. This is a well-established result in hardware power modeling.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">Why it matters for RackDCIM</h3>
        <p className="text-[#CBD5E0] text-sm leading-relaxed">
          Without this relationship, a monitoring system can only report power at
          the handful of operating points it has actually measured. With it, we
          can calculate power at <em className="text-white">any</em> frequency in
          a device's range — filling in the full curve instead of guessing between
          data points.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4">Live Curve</h3>
        <DVFSCurveChart machineClass="high_performance" />
      </div>
      <p className="text-center text-[#A0AEC0] text-[11px] mt-4">
        Simplified illustrative model — not yet affiliated with or endorsed by the referenced lab.
      </p>
    </div>
  );
}

export default DVFSAnalysis;