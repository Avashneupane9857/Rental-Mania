import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";

function Routing() {
  return (
    <div className="font-serif">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/sigup" element />
        <Route path="/login" element /> */}
        <Route path="/property/details" element={<PropertyDetailsPage />} />
      </Routes>
    </div>
  );
}

export default Routing;
