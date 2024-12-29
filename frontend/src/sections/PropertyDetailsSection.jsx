import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Host from "../components/Host";
import Map from "../components/Map";
import { PaymentdetailsCard } from "../components/PaymentdetailsCard";
import PdetailsPic from "../components/PdetailsPic";
import PdetailsSideBar from "../components/PdetailsSideBar";
import Reviews from "../components/Reviews";

import TopNavbar from "../components/TopNavbar";
import axios from "axios";
import { backendUrl } from "../../config";
import { useParams } from "react-router-dom";

function PropertyDetailsSection() {
  const { propertyId } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const handleFetch = async () => {
      try {
        const fetch = await axios.get(`${backendUrl}/property/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (fetch.status == 200) {
          setData(fetch.data.property);
        }
      } catch (e) {
        alert("Error in fetching data", e);
      }
    };
    handleFetch();
  }, []);
  return (
    <div className="w-[80%] mx-auto">
      <TopNavbar />
      <div className="h-[1px] relative top-14 w-[100%] bg-slate-400 opacity-20"></div>

      <div className="relative top-20 text-[26px]">{data.title}</div>

      <PdetailsPic data={data} />
      <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-28">
        <PdetailsSideBar data={data} />
        <PaymentdetailsCard data={data} />
      </div>
      <Map data={data} />
      <div className="h-[1px]  relative top-10 w-[100%] bg-slate-400 opacity-20"></div>
      <Reviews />
      <Host data={data} />
      <div className="">
        {" "}
        <Footer />
      </div>
    </div>
  );
}

export default PropertyDetailsSection;
