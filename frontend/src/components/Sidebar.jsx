import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import {
  FaHome,
  FaLink,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa"; 
import { FaChartBar } from "react-icons/fa6";

const navItems = [
  { to: "/dashboard", icon: FaHome, label: "Dashboard" },
  { to: "/mylinks", icon: FaLink, label: "My Links" },
  { to: "/grouplinks", icon: FaUsers, label: "Group Links" },
  { to: "/analytics", icon: FaChartBar, label: "Analytics" },
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation(); 

  return (
    <>
    
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900 text-white p-2 rounded-lg border border-zinc-700 active:scale-95 transition"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`
          bg-zinc-900 text-white border-r border-zinc-700
          transition-all duration-300 overflow-hidden

          fixed top-0 left-0 h-screen z-40
          ${open ? "w-16" : "w-0"} 

          md:static md:w-64 md:min-h-screen
          lg:sticky lg:top-0 lg:h-screen lg:min-h-0
        `}
      >
        <div className="hidden md:block px-6 py-3 border-b border-zinc-700">
          <Logo />
        </div>

        <div className="pt-20 md:pt-4 p-2 md:p-4">
          <nav className="space-y-2">
            

            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center md:gap-3 rounded-lg text-lg p-2 transition-all
                    justify-center md:justify-start
                    
                    /* Active styles vs Default/Hover styles */
                    ${isActive
                      ? "bg-zinc-800 text-(--accent-300) border border-(--accent-300)"
                      : "text-zinc-400 hover:text-white hover:border hover:border-(--accent-300)"
                    }
                  `}
                >
                  <Icon className="text-xl md:text-base" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}

          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
