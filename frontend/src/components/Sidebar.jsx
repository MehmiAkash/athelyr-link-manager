import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  FaHome,
  FaLink,
  FaStar,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900 text-white p-2 rounded-lg border border-zinc-700"
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
        `}
      >
        {/* Hide logo on mobile */}
        <div className="hidden md:block px-6 py-3 border-b border-zinc-700">
          <Logo />
        </div>

        <div className="pt-20 md:pt-4 p-2 md:p-4">
          <nav className="space-y-2">

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center md:gap-3 justify-center md:justify-start rounded-lg text-lg hover:border hover:border-rose-300 p-2"
            >
              <FaHome />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            <Link
              to="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center md:gap-3 justify-center md:justify-start rounded-lg text-lg hover:border hover:border-rose-300 p-2"
            >
              <FaStar />
              <span className="hidden md:inline">Favorites</span>
            </Link>

            <Link
              to="/mylinks"
              onClick={() => setOpen(false)}
              className="flex items-center md:gap-3 justify-center md:justify-start rounded-lg text-lg hover:border hover:border-rose-300 p-2"
            >
              <FaLink />
              <span className="hidden md:inline">My Links</span>
            </Link>

            <Link
              to="/grouplinks"
              onClick={() => setOpen(false)}
              className="flex items-center md:gap-3 justify-center md:justify-start rounded-lg text-lg hover:border hover:border-rose-300 p-2"
            >
              <FaUsers />
              <span className="hidden md:inline">Group Links</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => setOpen(false)}
              className="flex items-center md:gap-3 justify-center md:justify-start rounded-lg text-lg hover:border hover:border-rose-300 p-2"
            >
              <FaChartBar />
              <span className="hidden md:inline">Analytics</span>
            </Link>

          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;