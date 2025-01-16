import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiGlobe, CiMenuBurger } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { logo } from "../assets";

const TopNavbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const host = () => {
    navigate("/hosting");
    setShowMenu(false); // Close menu after navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu-container")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative top-6 flex justify-between items-center">
      <div className="flex-shrink-0">
        <a href="/" className="block">
          <img
            className="w-[100px] h-8 md:w-[120px] md:h-10"
            src={logo}
            alt="Logo"
          />
        </a>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop: Show button in header */}
        <button
          onClick={host}
          className="hidden md:block text-slate-800 hover:bg-slate-100 hover:rounded-2xl px-4 py-2 transition-all"
        >
          Switch to hosting
        </button>

        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <CiGlobe className="w-5 h-5" />
        </button>

        <div className="profile-menu-container relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="border border-slate-300 p-1 md:p-2 flex items-center gap-1 bg-white rounded-full shadow-lg hover:shadow-md transition-all"
          >
            <CiMenuBurger className="w-4 h-4 md:w-5 md:h-5" />
            <IoPersonCircleOutline className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Profile
              </a>
              <a
                href="/reservations"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Reservations
              </a>
              <a
                href="/messages"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Messages
              </a>
              {/* Mobile: Show hosting button in dropdown */}
              <button
                onClick={host}
                className="md:hidden w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Switch to hosting
              </button>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
