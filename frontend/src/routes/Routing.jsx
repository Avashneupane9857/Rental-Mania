import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HostLanding from "../adminPages/HostLanding";
import HostListing from "../adminPages/HostListing";

function Routing() {
  return (
    <div className="font-serif">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/property/details" element={<PropertyDetailsPage />} />
        <Route path="/hosting" element={<HostLanding />} />
        <Route path="/hosting/listing" element={<HostListing />} />
      </Routes>
    </div>
  );
}

export default Routing;
