/* eslint-disable react/prop-types */
import { ChevronRight } from "lucide-react";
import { cat1, cat2, cat3, cat4, cat5, cat6 } from "../assets";

function Category({ onCategorySelect, selectedCategory }) {
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
  ];

  return (
    <div className="grid grid-cols-12">
      {categories.map(({ id, category, icon }) => (
        <div
          onClick={() => onCategorySelect(category)}
          key={id}
          className="relative top-20 flex flex-col w-16 cursor-pointer group"
        >
          <div
            className={`${
              selectedCategory === category ? "opacity-100" : "opacity-60"
            } hover:opacity-100`}
          >
            <img className="w-6 h-6" src={icon} alt={category} />
            <p className="text-[12px] hover:text-black">{category}</p>
          </div>
          <div
            className={`bg-black w-8 h-[1px] ${
              selectedCategory === category ? "opacity-45" : "opacity-0"
            } group-hover:opacity-45 transition-opacity duration-300`}
          ></div>
        </div>
      ))}
      <button className="relative top-10 left-[1250px] border-2 rounded-full w-8 h-8 flex justify-center transition-transform items-center hover:scale-110 hover:shadow-lg">
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
      </button>
    </div>
  );
}

export default Category;
