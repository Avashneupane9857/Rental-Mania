import ANavbar from "../adminComponents/ANavbar";
import { prop5 } from "../assets";
function HostListing() {
  return (
    <div className="px-11">
      <ANavbar />
      <h1 className="relative top-20 p-8 font-medium text-slate-700 text-2xl">
        Your Listings
      </h1>
      <div className="relative top-14 rounded-lg  bg-[#f7f7f7] w-[400px] h-[350px]">
        <img src={prop5} width={500} height={600} alt="" />
        <p className="px-5 py-2">location</p>
        <p className="px-5 py-2">PropertyName</p>
      </div>
    </div>
  );
}

export default HostListing;
