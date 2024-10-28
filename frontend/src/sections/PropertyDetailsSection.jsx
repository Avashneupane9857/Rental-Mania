import Footer from "../components/Footer";
import Host from "../components/Host";
import Map from "../components/Map";
import PaymentdetailsCard from "../components/PaymentdetailsCard";
import PdetailsPic from "../components/PdetailsPic";
import PdetailsSideBar from "../components/PdetailsSideBar";
import Reviews from "../components/Reviews";

import TopNavbar from "../components/TopNavbar";

function PropertyDetailsSection() {
  return (
    <div className="w-[80%] mx-auto">
      <TopNavbar />
      <div className="h-[1px] relative top-14 w-[100%] bg-slate-400 opacity-20"></div>
      <div className="relative top-20 text-[26px]">
        Wooded Luxury Attic Suite w/ Mountain Views
      </div>

      <PdetailsPic />
      <div className="flex w-[100%] gap-28 mx-auto">
        {" "}
        <PdetailsSideBar />
        <PaymentdetailsCard />
      </div>
      <Map />
      <div className="h-[1px] relative top-[350px] w-[100%] bg-slate-400 opacity-20"></div>
      <Reviews />
      <Host />
      <div className="relative top-96">
        {" "}
        <Footer />
      </div>
    </div>
  );
}

export default PropertyDetailsSection;
