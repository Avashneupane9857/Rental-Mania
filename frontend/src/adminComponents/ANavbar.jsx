import { useNavigate } from "react-router-dom";
import { logo } from "../assets";
import { CiGlobe, CiMenuBurger } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";

function ANavbar() {
  const navigate = useNavigate();
  const host = () => {
    navigate("/");
  };

  const handlehostListing = () => {
    navigate("/hosting/listing");
  };
  return (
    <div className="">
      <header className="relative top-8 flex justify-between">
        <div className="relative top-1">
          <img className="w-[100px] h-8" src={logo} alt="" />
        </div>
        <div className="flex justify-items-center gap-9 ">
          <button className="underline">Today</button>
          <button onClick={handlehostListing} className="hover:underline">
            Listing
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={host}
            className="text-slate-800 hover:bg-slate-100 hover:rounded-2xl w-36   "
          >
            Switch to tenant
          </button>
          <button>
            <CiGlobe className="w-5 h-5" />
          </button>
          <button className="border-[1px] w-20 p-1 flex justify-center items-center gap-1 bg-white border-slate-300 rounded-2xl shadow-xl">
            <CiMenuBurger className="w-5 h-4" />
            <IoPersonCircleOutline className="w-8 h-8 rounded-full" />
          </button>
        </div>
      </header>
    </div>
  );
}

export default ANavbar;
