import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiGlobe, CiMenuBurger } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { logo } from "../assets";

function TopNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const host = () => {
    navigate("/hosting");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".profile-menu-container")) {
      setShowMenu(false);
    }
  };

  useState(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative top-6 flex justify-between">
      <div>
        <a href="/">
          <img className="w-[100px] h-8" src={logo} alt="" />
        </a>
      </div>
      <div className="flex gap-4">
        <button
          onClick={host}
          className="text-slate-800 hover:bg-slate-100 hover:rounded-2xl w-36"
        >
          Switch to hosting
        </button>
        <button>
          <CiGlobe className="w-5 h-5" />
        </button>
        <div className="profile-menu-container relative">
          <button
            onClick={toggleMenu}
            className="border border-slate-300 w-20 p-1 flex justify-center items-center gap-1 bg-white rounded-2xl shadow-xl hover:shadow-md transition-shadow"
          >
            <CiMenuBurger className="w-5 h-4" />
            <IoPersonCircleOutline className="w-8 h-8 rounded-full" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Settings
              </a>
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
}

export default TopNavbar;
