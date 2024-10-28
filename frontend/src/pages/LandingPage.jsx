import Footer from "../components/Footer";
import Category from "../sections/Category";
import Navbar from "../sections/Navbar";
import PropertySection from "../sections/PropertySection";

function LandingPage() {
  return (
    <div>
      <div className="w-[90%] mx-auto">
        <Navbar />
        <Category />
        <PropertySection />
        <Footer />
      </div>{" "}
    </div>
  );
}

export default LandingPage;
