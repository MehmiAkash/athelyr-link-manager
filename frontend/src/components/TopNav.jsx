import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaLink,
  FaUsers,
  FaChartBar,
  FaStar,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const navItems = [
  { to: "/dashboard", icon: FaHome, label: "Dashboard" },
  { to: "/favorites", icon: FaStar, label: "Favorites" },
  { to: "/mylinks", icon: FaLink, label: "My Links" },
  { to: "/grouplinks", icon: FaUsers, label: "Group Links" },
  { to: "/analytics", icon: FaChartBar, label: "Analytics" },
];

function TopNav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const location = useLocation();

  const handleNavClick = () => {
    setOpen(false);
    setHovered(null);
  };

  return (
    <div className="md:hidden fixed top-2 left-2 z-50">

      <button
        onClick={() => {
          setOpen((prev) => !prev);
          setHovered(null);
        }}
        className="
          flex items-center justify-center
          w-11 h-11
          bg-zinc-900
          border border-zinc-700
          rounded-full
          text-white text-xl
          shadow-xl
          hover:bg-zinc-800
          hover:text-(--accent-300)
          active:scale-95
          transition
        "
      >
        {open ? <HiX /> : <HiMenu />}
      </button>


      {open && (
        <div
          className="
            mt-2
            flex flex-col 
            w-11
            bg-zinc-900
            border border-zinc-700
            rounded-2xl
            p-1
            shadow-xl
          "
        >
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;

            return (
              <div
                key={to}
                className="relative"
                onMouseEnter={() => setHovered(label)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() => setHovered(label)}
                onTouchEnd={() => setHovered(null)}
              >
                <Link
                  to={to}
                  aria-label={label}
                  onClick={handleNavClick}
                  className={`
                    flex items-center justify-center
                    w-full h-12
                    rounded-xl
                    text-2xl
                    active:scale-95
                    transition
                    ${isActive
                      ? "bg-zinc-700 text-(--accent-400)"
                      : "text-white hover:bg-zinc-800 hover:text-(--accent-300)"
                    }
                  `}
                >
                  <Icon />
                </Link>

                {hovered === label && (
                  <span
                    className="
                      absolute
                      left-full
                      top-1/2
                      -translate-y-1/2
                      ml-2
                      whitespace-nowrap
                      bg-zinc-800
                      border border-zinc-700
                      text-white
                      text-sm
                      px-2 py-1.5
                      rounded-lg
                      shadow-lg
                      pointer-events-none
                      z-50
                    "
                  >
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopNav;