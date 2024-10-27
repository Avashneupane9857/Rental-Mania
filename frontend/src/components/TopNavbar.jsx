import { logo } from "../assets";
import { CiGlobe } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiMenuBurger } from "react-icons/ci";
function TopNavbar() {
  return (
    <div className="relative top-6 flex justify-between  ">
      <div>
        <a href="/">
          {" "}
          <img className="w-[100px] h-8" src={logo} alt="" />
        </a>
      </div>
      {/* <div className="relative top-1 "> Stays & Experiences</div> */}
      <div className="flex gap-4">
        <button className="text-slate-800 hover:bg-slate-100 hover:rounded-2xl w-36   ">
          Switch to hosting
        </button>
        <button>
          <CiGlobe className="w-5 h-5" />
        </button>
        <button className="border-[1px] w-20 p-1 flex justify-center items-center gap-1 bg-white border-slate-300 rounded-2xl shadow-xl">
          <CiMenuBurger className="w-5 h-4" />
          <IoPersonCircleOutline className="w-8 h-8 rounded-full" />
        </button>
      </div>
    </div>
  );
}

export default TopNavbar;
