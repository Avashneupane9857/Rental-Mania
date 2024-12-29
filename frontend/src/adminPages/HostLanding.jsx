import ANavbar from "../adminComponents/ANavbar";
import AdminHero from "../adminSections/AdminHero";

function HostLanding() {
  return (
    <div className="w-[80%] mx-auto">
      <ANavbar />
      <div className="relative top-44">
        {" "}
        <AdminHero />
      </div>
    </div>
  );
}

export default HostLanding;
