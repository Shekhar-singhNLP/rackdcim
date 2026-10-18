import { Network } from "lucide-react";
import MarketplaceComparisonChart from "../../components/MarketplaceComparisonChart";

function ClusterMarketplace() {
  return (
    <div className="p-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Network size={18} className="text-cyan-400" />
        <h1 className="text-white text-xl font-bold">Cooperative Power Sharing</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-6">
        Based on: Da Costa & Stolf (2025), Cluster Computing — Marketplace for Geo-Distributed Data Centers
      </p>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">The Idea</h3>
        <p className="text-[#CBD5E0] text-sm leading-relaxed">
          If two facilities each have some spare renewable power at different
          times, do they do better by sharing it with each other (cooperative),
          or by each managing their own supply independently (non-cooperative)?
          This paper compares both approaches for sites relying only on
          renewable energy.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">Why it matters for RackDCIM</h3>
        <p className="text-[#CBD5E0] text-sm leading-relaxed">
          Our normalized telemetry schema already tracks per-device and per-class
          power — the same shape of data a cooperative-sharing simulation would
          need as input, across multiple sites rather than one.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4">Live Comparison</h3>
        <MarketplaceComparisonChart />
      </div>
      <p className="text-center text-[#A0AEC0] text-[11px] mt-4">
        Simplified illustrative model — not yet affiliated with or endorsed by the referenced lab.
      </p>
    </div>
  );
}

export default ClusterMarketplace;