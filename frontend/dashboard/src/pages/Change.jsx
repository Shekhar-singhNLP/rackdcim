import { GitBranch, PlusCircle, MinusCircle, Settings2, RefreshCw, Clock } from "lucide-react";

const CHANGE_CATEGORIES = [
  { key: "additions", label: "Additions", icon: PlusCircle, color: "#4ade80" },
  { key: "decommissions", label: "Decommissions", icon: MinusCircle, color: "#f87171" },
  { key: "config", label: "Config Changes", icon: Settings2, color: "#3b82f6" },
  { key: "firmware", label: "Firmware Updates", icon: RefreshCw, color: "#f97316" },
];

// Placeholder counts — will be populated once change events are persisted
// to the time-series database (see backend/storage/).
const changeCounts = { additions: 0, decommissions: 0, config: 0, firmware: 0 };

function Change() {
  return (
    <div className="pt-6 px-7 pb-7 h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <GitBranch size={18} className="text-brand" />
        <h1 className="text-white text-xl font-bold">Change Management</h1>
      </div>
      <p className="text-gray-500 text-[12.5px] mb-8">
        Audit trail of additions, decommissions, and configuration changes
      </p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {CHANGE_CATEGORIES.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-surface border border-border rounded-xl p-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
              style={{ background: `${color}1a` }}
            >
              <Icon size={16} color={color} />
            </div>
            <p className="text-white text-2xl font-extrabold">{changeCounts[key]}</p>
            <p className="text-gray-500 text-[11px] mt-1">{label}</p>
            <p className="text-gray-700 text-[10px] mt-0.5">Last 30 days</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-[#161616]">
          <p className="text-gray-300 text-sm font-medium">Recent Change Events</p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-6">
          <Clock size={28} className="text-gray-700 mb-4" />
          <p className="text-gray-400 text-sm font-medium mb-1.5">No change events logged yet</p>
          <p className="text-gray-600 text-[12px] text-center max-w-md">
            Once devices are added, removed, or reconfigured, each event will appear here
            with a timestamp, category, and description — building a full audit trail over time.
          </p>
        </div>
      </div>

      <p className="text-gray-600 text-[11px] mt-6">
        🚧 Change event persistence (write-ahead log to <code className="text-gray-500">backend/storage/</code>) is
        planned for a future phase — the categories and layout above reflect the intended structure.
      </p>
    </div>
  );
}

export default Change;