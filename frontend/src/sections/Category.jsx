/* eslint-disable react/prop-types */
import { cat1, cat2, cat3, cat4, cat5, cat6 } from "../assets";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Category = ({ onCategorySelect, selectedCategory }) => {
  const scrollContainerRef = useRef(null);

  const categories = [
    { id: 1, icon: cat1, category: "Farms" },
    { id: 2, icon: cat2, category: "Villa" },
    { id: 3, icon: cat3, category: "Home" },
    { id: 4, icon: cat4, category: "Cabin" },
    { id: 5, icon: cat5, category: "Farms" },
    { id: 6, icon: cat6, category: "Camp" },
    { id: 7, icon: cat1, category: "Beach" },
    { id: 8, icon: cat2, category: "Mansion" },
    { id: 9, icon: cat1, category: "Bungalow" },
    { id: 10, icon: cat6, category: "Treehouse" },
    { id: 11, icon: cat4, category: "Penthouse" },
    { id: 12, icon: cat3, category: "Castle" },
    { id: 13, icon: cat4, category: "Cabin" },
    { id: 14, icon: cat5, category: "Farms" },
    { id: 19, icon: cat6, category: "Camp" },
    { id: 20, icon: cat1, category: "Beach" },
    { id: 80, icon: cat2, category: "Mansion" },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full px-4 md:px-6 top-20 lg:px-8">
      <div className="flex items-center">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 z-10 border-2 rounded-full w-8 h-8 justify-center items-center hover:scale-110 hover:shadow-lg bg-white transition-transform"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 py-4 px-2 scroll-smooth"
        >
          {categories.map(({ id, category, icon }) => (
            <div
              onClick={() => onCategorySelect(category)}
              key={id}
              className="flex flex-col items-center min-w-[4rem] cursor-pointer group"
            >
              <div
                className={`${
                  selectedCategory === category ? "opacity-100" : "opacity-60"
                } hover:opacity-100 flex flex-col items-center`}
              >
                <img
                  className="w-6 h-6 object-contain"
                  src={icon}
                  alt={category}
                />
                <p className="text-[12px] text-center whitespace-nowrap hover:text-black">
                  {category}
                </p>
              </div>
              <div
                className={`bg-black w-8 h-[1px] mt-1 ${
                  selectedCategory === category ? "opacity-45" : "opacity-0"
                } group-hover:opacity-45 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 z-10 border-2 rounded-full w-8 h-8 justify-center items-center hover:scale-110 hover:shadow-lg bg-white transition-transform"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
        </button>
      </div>
    </div>
  );
};

export default Category;
