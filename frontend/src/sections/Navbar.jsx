import SearchBar from "../components/SearchBar";
import TopNavbar from "../components/TopNavbar";

function Navbar() {
  return (
    <div>
      <TopNavbar />
      <div className="flex justify-center">
        {" "}
        <SearchBar />
      </div>
    </div>
  );
}

export default Navbar;
