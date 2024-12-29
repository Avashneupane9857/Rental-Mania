import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleCloseSearch = () => {
    setIsExpanded(false);
  };

  return (
    <div className="w-full md:w-[90%] lg:w-[70%] mx-auto relative top-10">
      {/* Mobile Search Button */}
      <div className="md:hidden flex justify-center">
        <button
          onClick={handleSearchClick}
          className="flex items-center gap-3 bg-white border rounded-full shadow-md hover:shadow-lg p-4 w-[80%] transition-all"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          <span className="text-sm font-medium text-gray-700">
            Search destinations
          </span>
        </button>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-row items-center bg-white border rounded-full shadow-md hover:shadow-lg transition-all">
        {/* Where Section */}
        <div
          onClick={handleSearchClick}
          className="flex-1 min-w-[320px] p-5 pl-10 cursor-pointer hover:bg-[#EBEBEB] rounded-full"
        >
          <div className="text-sm font-medium">Where</div>
          <input
            type="text"
            placeholder="Search destinations"
            className="w-full bg-transparent border-none outline-none text-gray-600 placeholder-gray-500 text-sm"
          />
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Check in Section */}
        <div
          onClick={handleSearchClick}
          className="flex-1 min-w-[120px] p-5 pl-8 rounded-full cursor-pointer hover:bg-[#EBEBEB]"
        >
          <div className="text-sm font-medium">Check in</div>
          <div className="text-sm text-gray-500">Add dates</div>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Check out Section */}
        <div
          onClick={handleSearchClick}
          className="flex-1 min-w-[120px] p-5 pl-8 rounded-full cursor-pointer hover:bg-[#EBEBEB]"
        >
          <div className="text-sm font-medium">Check out</div>
          <div className="text-sm text-gray-500">Add dates</div>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Guests Section */}
        <div
          onClick={handleSearchClick}
          className="flex-1 min-w-[120px] p-5 pl-10 rounded-full cursor-pointer hover:bg-[#EBEBEB]"
        >
          <div className="text-sm font-medium">Who</div>
          <div className="text-sm text-gray-500">Add guests</div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#DE1162] text-white px-6 py-4 rounded-full mx-2 transition-all"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          <span className="font-medium text-sm">Search</span>
        </button>
      </div>

      {/* Expanded Search Interface (Shows on both mobile and desktop when clicked) */}
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={handleCloseSearch}
          />

          <div className="absolute top-0 left-0 right-0 bg-white rounded-3xl shadow-2xl p-8 z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Search places</h2>
              <button
                onClick={handleCloseSearch}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 border rounded-xl">
                <h3 className="font-medium mb-2">Where to?</h3>
                <input
                  type="text"
                  placeholder="Search destinations"
                  className="w-full p-3 border rounded-lg"
                  autoFocus
                />
              </div>

              <div className="p-4 border rounded-xl">
                <h3 className="font-medium mb-2">When?</h3>
                <div className="flex gap-4">
                  <input
                    type="date"
                    className="flex-1 p-3 border rounded-lg"
                    placeholder="Check in"
                  />
                  <input
                    type="date"
                    className="flex-1 p-3 border rounded-lg"
                    placeholder="Check out"
                  />
                </div>
              </div>

              <div className="p-4 border rounded-xl">
                <h3 className="font-medium mb-2">Who is coming?</h3>
                <div className="flex justify-between items-center">
                  <span>Guests</span>
                  <div className="flex items-center gap-4">
                    <button className="p-2 border rounded-full">-</button>
                    <span>0</span>
                    <button className="p-2 border rounded-full">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
