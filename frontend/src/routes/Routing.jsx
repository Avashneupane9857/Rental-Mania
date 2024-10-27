import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

function Routing() {
  return (
    <div className="font-serif">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/sigup" element />
        <Route path="/login" element /> */}
      </Routes>
    </div>
  );
}

export default Routing;
