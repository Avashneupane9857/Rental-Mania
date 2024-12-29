import SearchBar from "../components/SearchBar";
import TopNavbar from "../components/TopNavbar";

const Navbar = () => {
  return (
    <nav className="container mx-auto px-4 md:px-6 lg:px-8">
      <TopNavbar />
      <div className="flex justify-center w-full">
        <SearchBar />
      </div>
      <div className="h-[1px] relative top-16 w-full bg-slate-400/20"></div>
    </nav>
  );
};

export default Navbar;
