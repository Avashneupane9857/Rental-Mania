import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HostLanding from "../adminPages/HostLanding";
import HostListing from "../adminPages/HostListing";
import ListProperties from "../adminPages/ListProperties";
import EditProperty from "../pages/EditProperty";
import Reservations from "../pages/Reservations";

function Routing() {
  return (
    <div className="font-serif">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/propertyDetails/:propertyId"
          element={<PropertyDetailsPage />}
        />
        <Route path="/hosting" element={<HostLanding />} />
        <Route path="/hosting/listings" element={<HostListing />} />
        <Route path="/become-a-host" element={<ListProperties />} />
        <Route
          path="/hosting/property/edit/:propertyId"
          element={<EditProperty />}
        />
        <Route path="reservations" element={<Reservations />} />
      </Routes>
    </div>
  );
}

export default Routing;
