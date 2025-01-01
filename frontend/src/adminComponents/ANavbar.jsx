import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo } from "../assets";
import { CiGlobe, CiMenuBurger } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";

function ANavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const host = () => {
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handlehostListing = () => {
    navigate("/hosting/listings");
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };
  const handleLogoClick = () => {
    navigate("/hosting");
  };
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 md:px-6 lg:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex-shrink-0 cursor-pointer "
          >
            <img
              className="w-[100px] h-8 object-contain"
              src={logo}
              alt="Logo"
            />
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={handlehostListing} className="hover:underline">
              Listing
            </button>
            <button onClick={host} className="hover:underline">
              Switch to tenant
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <CiGlobe className="w-5 h-5" />
            </button>

            {/* Desktop Profile Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="border p-2 flex items-center gap-1 bg-white border-slate-300 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <CiMenuBurger className="w-5 h-4" />
                <IoPersonCircleOutline className="w-6 h-6" />
              </button>

              {/* Desktop Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <CgProfile className="w-5 h-5" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FiLogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden border p-2 flex items-center gap-1 bg-white border-slate-300 rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <CiMenuBurger className="w-5 h-4" />
              <IoPersonCircleOutline className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="absolute right-0 top-0 h-full w-64 bg-white p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <IoMdClose className="w-6 h-6" />
              </button>

              {/* Mobile Menu Items */}
              <div className="mt-16 flex flex-col space-y-4">
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  <CgProfile className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={handlehostListing}
                  className="p-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  Today
                </button>
                <button
                  onClick={handlehostListing}
                  className="p-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  Listing
                </button>
                <button
                  onClick={host}
                  className="p-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  Switch to tenant
                </button>
                <div className="h-px bg-gray-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-left text-red-600"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="p-2">
                  <p className="text-sm text-gray-500">Help & resources</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ANavbar;
