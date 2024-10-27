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
      <div className="h-[1px] relative top-16 w-[100%] bg-slate-400 opacity-20"></div>
    </div>
  );
}

export default Navbar;
