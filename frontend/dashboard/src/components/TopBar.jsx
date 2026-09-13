import { Search, Bell, Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const topNavItems = ["Dashboard", "Visualization", "Capacity", "Assets", "Reports"];

function TopBar() {
  return (
    <header className="h-[58px] bg-[#0f0f0f] border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 select-none">
          <div className="w-2 h-2 bg-green-500 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="text-[15px] font-bold tracking-wide">
            <span className="text-white">R</span>
            <span className="text-green-500">Λ</span>
            <span className="text-white">CK</span>
            <span className="text-gray-500 font-medium ml-0.5">dcim</span>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-[12.5px] font-medium"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <nav className="flex gap-6 ml-2">
          {topNavItems.map((item) => (
            <span
              key={item}
              className="text-gray-400 text-[13px] font-medium cursor-pointer hover:text-white transition-colors"
            >
              {item}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-surfaceLight border border-border rounded-lg px-3 py-1.5 w-[180px]">
          <Search size={14} className="text-gray-500" />
          <span className="text-gray-500 text-[12.5px]">Quick search...</span>
        </div>
        <Bell size={17} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
        <Settings size={17} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
        <div className="w-[30px] h-[30px] rounded-full bg-[#262626] flex items-center justify-center text-gray-300 text-[13px] font-semibold">
          S
        </div>
      </div>
    </header>
  );
}

export default TopBar;