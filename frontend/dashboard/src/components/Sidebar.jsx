import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, HeartPulse, Lightbulb, Boxes,
  LayoutGrid, Zap, Wind, Network, GitBranch, FileBarChart,
  ChevronLeft, ChevronRight, Cpu, Target,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";

const navSections = [
  {
    heading: "Research",
    links: [
      { label: "DVFS Modeling", path: "/dashboard/research/dvfs", icon: Cpu },
      { label: "QoS Scheduling", path: "/dashboard/research/qos", icon: Target },
      { label: "Power Sharing", path: "/dashboard/research/marketplace", icon: Network },
    ],
  },
  {
    heading: "Standard",
    links: [
      { label: "Enterprise Overview", path: "/dashboard/overview", icon: LayoutDashboard },
      { label: "Enterprise Health", path: "/dashboard/health", icon: HeartPulse },
      { label: "What-if", path: "/dashboard/what-if", icon: Lightbulb },
      { label: "Inventory", path: "/dashboard/inventory", icon: Boxes },
      { label: "Space", path: "/dashboard/space", icon: LayoutGrid },
      { label: "Power", path: "/dashboard/power", icon: Zap },
      { label: "Cooling", path: "/dashboard/cooling", icon: Wind },
      { label: "Connectivity", path: "/dashboard/connectivity", icon: Network },
      { label: "Change", path: "/dashboard/change", icon: GitBranch },
      { label: "Data Reports", path: "/dashboard/reports", icon: FileBarChart },
    ],
  },
];

function NavItem({ label, path, icon: Icon, collapsed }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const itemRef = useRef(null);

  function handleMouseEnter() {
    if (!collapsed || !itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setCoords({ top: rect.top + rect.height / 2, left: rect.right + 12 });
    setHovered(true);
  }

  return (
    <div ref={itemRef} onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-4 rounded-lg text-sm font-medium transition-colors ${
            collapsed ? "justify-center" : ""
          } ${
            isActive
              ? "bg-[#132a1c] text-brand"
              : "text-gray-400 hover:text-white hover:bg-[#161616]"
          }`
        }
      >
        <Icon size={18} strokeWidth={1.8} className="shrink-0" />
        {!collapsed && label}
      </NavLink>

      {collapsed &&
        hovered &&
        createPortal(
          <span
            style={{ top: coords.top, left: coords.left, transform: "translateY(-50%)" }}
            className="fixed whitespace-nowrap rounded-md bg-[#1c1c1c] px-3 py-1.5 text-xs font-medium text-gray-200 shadow-lg shadow-black/40 z-[9999] pointer-events-none"
          >
            {label}
          </span>,
          document.body
        )}
    </div>
  );
}

function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`bg-[#0f0f0f] border-r border-border h-full py-12 shrink-0 overflow-visible transition-all duration-200 ${
        sidebarCollapsed ? "w-[76px] px-3" : "w-[280px] px-5"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-9 h-9 mb-10 rounded-lg text-gray-500 hover:text-brand hover:bg-[#161616] transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {navSections.map((section) => (
        <div key={section.heading} className="mb-10">
          {!sidebarCollapsed && (
            <p className="text-gray-600 text-[11px] font-bold uppercase tracking-wider px-3 mb-4">
              {section.heading}
            </p>
          )}
          <div className="flex flex-col gap-7">
            {section.links.map((link) => (
              <NavItem key={link.path} {...link} collapsed={sidebarCollapsed} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;