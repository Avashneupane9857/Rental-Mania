import Footer from "../components/Footer";

import Navbar from "../sections/Navbar";
import PropertySection from "../sections/PropertySection";

function LandingPage() {
  return (
    <div>
      <div className="w-[90%] mx-auto">
        <Navbar />

        <PropertySection />
        <Footer />
      </div>{" "}
    </div>
  );
}

export default LandingPage;
