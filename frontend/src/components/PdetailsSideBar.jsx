/* eslint-disable react/prop-types */
import { useState } from "react";
import { cat1, cat2, cat3, cat6, person } from "../assets";

function PdetailsSideBar({ data }) {
  const Enum = [
    { id: 1, img: cat1, title: "Free parking on premises" },
    { id: 2, img: cat2, title: "Dedicated workspace" },
    { id: 3, img: cat2, title: "Mountain view" },
    { id: 4, img: cat3, title: "Lock on bedroom door" },
    { id: 5, img: cat6, title: "Dedicated workspace" },
    { id: 6, img: cat1, title: "Free parking on premises" },
    { id: 7, img: cat2, title: "Dedicated workspace" },
    { id: 8, img: cat2, title: "Mountain view" },
    { id: 9, img: cat3, title: "Lock on bedroom door" },
    { id: 10, img: cat6, title: "Dedicated workspace" },
  ];

  const col1 = Enum.slice(0, 5);
  const [isExpanded, setIsExpanded] = useState(false);

  const text = `${data.description}`;
  const words = text.split(" ");
  const wordLimit = 50;
  const showBtn = words.length > wordLimit;
  const displayText = isExpanded
    ? text
    : words.slice(0, wordLimit).join(" ") + (showBtn ? "..." : " ");

  return (
    <div className="w-full lg:w-[70%] px-4 lg:px-0 py-8 space-y-8">
      {/* Property Name */}
      <div>
        <h1 className="text-xl md:text-2xl font-medium">{data.propertyName}</h1>
        <div className="w-full h-px bg-black/10 mt-4"></div>
      </div>

      {/* Host Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img src={person} className="rounded-full w-8 h-8" alt="host" />
          <span className="text-base md:text-lg">Hosted by</span>
          <span className="text-base md:text-lg font-medium">
            {data.username}
          </span>
        </div>
        <div className="w-full h-px bg-black/10"></div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">About our place</h2>
        <div className="space-y-2">
          <p className="text-justify text-slate-700 text-base md:text-lg">
            {displayText}
          </p>
          {showBtn && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="underline text-base md:text-lg hover:text-gray-600 transition-colors"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>

      {/* Place Offers */}
      <div className="space-y-6">
        <div className="w-full h-px bg-black/10"></div>
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-medium">What place offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {col1.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-8 h-8 flex-shrink-0">
                  <img
                    className="w-full h-full object-contain"
                    src={item.img}
                    alt={item.title}
                  />
                </div>
                <h3 className="text-base md:text-lg font-thin text-slate-800">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdetailsSideBar;
