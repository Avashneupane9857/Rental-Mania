import { Search } from "lucide-react";
function SearchBar() {
  return (
    <div className="w-[70%] mx-auto  relative top-10 ">
      <div className="flex items-center bg-white border-[1px] rounded-full shadow-md hover:shadow-lg transition-shadow">
        <div className="flex-1 min-w-[320px] p-5  pl-10 cursor-pointer hover:bg-[#EBEBEB] rounded-full">
          <div className="text-sm font-medium ">Where</div>
          <input
            type="text"
            placeholder="Search destinations"
            className="w-full bg-transparent border-none outline-none text-gray-600 placeholder-gray-500 text-sm"
          />
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        <div className="flex-1 min-w-[120px] p-5  pl-8 rounded-full cursor-pointer hover:bg-[#EBEBEB]">
          <div className="text-sm font-medium">Check in</div>
          <div className="text-sm text-gray-500">Add dates</div>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        <div className="flex-1 min-w-[120px] p-5  pl-8 rounded-full cursor-pointer hover:bg-[#EBEBEB]">
          <div className="text-sm font-medium">Check out</div>
          <div className="text-sm text-gray-500">Add dates</div>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        <div className="flex-1 min-w-[120px] p-5  pl-10 rounded-full cursor-pointer hover:bg-[#EBEBEB]">
          <div className="text-sm font-medium">Who</div>
          <div className="text-sm text-gray-500">Add guests</div>
        </div>

        <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-4 rounded-full ml-2 mr-2 transition-colors">
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
