import { useState } from "react";
import { Menu, X, User, Mail, Phone } from "lucide-react";

function AboutContactMenu() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  function toggleSection(section) {
    setActiveSection(activeSection === section ? null : section);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 rounded-lg border border-white/10 bg-[#0a0f1a]/95 backdrop-blur-sm shadow-xl py-2">
          <button
            onClick={() => toggleSection("about")}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <User size={14} />
            About
          </button>
          {activeSection === "about" && (
            <div className="px-4 pb-3 pt-1 text-xs text-gray-500 leading-relaxed border-b border-white/5">
              I'm a Btech 3rd year student — building RackDCIM out of a genuine
              interest in data center infrastructure and power systems.
            </div>
          )}

          <button
            onClick={() => toggleSection("contact")}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left mt-1"
          >
            <Mail size={14} />
            Contact
          </button>
          {activeSection === "contact" && (
            <div className="px-4 pb-3 pt-1 text-xs text-gray-500 leading-relaxed flex flex-col gap-1.5">
              {/* TODO: replace with info@rackdcim.com once domain email is set up */}
              <div className="flex items-center gap-2">
                <Mail size={12} />
                shekharsingh7ai@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} />
                +91 7275675575
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AboutContactMenu;