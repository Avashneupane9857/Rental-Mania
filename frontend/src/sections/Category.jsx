import { useState } from "react";
import { cat1, cat2, cat3, cat4, cat5, cat6 } from "../assets";
import { ChevronRight, ChevronLeft } from "lucide-react";
function Category() {
  const categories = [
    { icon: cat1, category: "Farns" },
    { icon: cat2, category: "Villa" },
    { icon: cat3, category: "Home" },
    { icon: cat4, category: "Cabin" },
    { icon: cat5, category: "Farns" },
    { icon: cat6, category: "Camp" },
    { icon: cat1, category: "Farns" },
    { icon: cat2, category: "Villa" },
    { icon: cat1, category: "Farns" },
    { icon: cat2, category: "Villa" },
    { icon: cat1, category: "Farns" },
    { icon: cat2, category: "Villa" },
  ];
  //   const [other, setOther] = useState(false);

  return (
    <div className="grid grid-cols-12">
      {" "}
      {categories.map(({ icon, category }) => (
        <div
          key={icon}
          className="relative top-20 flex flex-col w-16 cursor-pointer group"
        >
          <div className="opacity-60 hover:opacity-100">
            <img className="w-6 h-6" src={icon} alt={category} />
            <p className="text-[12px] hover:text-black">{category}</p>
          </div>

          <div className="bg-black opacity-0 w-8 h-[1px] group-hover:opacity-45 transition-opacity duration-300"></div>
        </div>
      ))}
      <button className="relative top-10 left-[1250px] border-2 rounded-full w-8 h-8 flex justify-center transition-transform items-center hover:scale-110 hover:shadow-lg ">
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900 " />
      </button>
    </div>
  );
}

export default Category;
