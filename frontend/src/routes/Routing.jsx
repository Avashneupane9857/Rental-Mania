import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

function Routing() {
  return (
    <div className="font-serif">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/property/details" element={<PropertyDetailsPage />} />
      </Routes>
    </div>
  );
}

export default Routing;
