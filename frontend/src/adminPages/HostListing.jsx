import { useEffect, useState } from "react";
import ANavbar from "../adminComponents/ANavbar";

import axios from "axios";
import { backendUrl } from "../../config";
function HostListing() {
  const token = localStorage.getItem("authToken");
  const [datas, setDatas] = useState("");
  useEffect(() => {
    const handleResponse = async () => {
      const response = await axios.get(`${backendUrl}/host/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        setDatas(response.data);
      }
    };
    handleResponse();
  }, []);
  return (
    <div className="px-11">
      <ANavbar />
      <h1 className="relative top-20 p-8 font-medium text-slate-700 text-2xl">
        Your Listings
      </h1>
      <div className="w-[400px]">
        <div className="relative top-20 rounded-lg  bg-[#f7f7f7] w-[400px] h-[350px]">
          <img src={datas.imageSrc[0]} width={500} height={600} alt="" />
          <p className="px-5 py-2">{datas.locationName}</p>
          <p className="px-5 py-2">{datas.PropertyName}</p>
        </div>
        <div className="relative top-20 p-5 flex justify-between">
          <button className="  text-red-600 border-[1px] w-16  hover:text-red-400 border-black rounded-lg">
            Delete
          </button>
          <button className="  text-red-600 border-[1px] w-16  hover:text-red-400 border-black rounded-lg">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default HostListing;
