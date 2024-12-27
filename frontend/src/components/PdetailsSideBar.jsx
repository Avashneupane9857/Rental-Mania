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
  //   const col2 = Enum.slice(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const text =
    "Tra - A Boutique stay, is a premWe l is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the Your room is on the second (U.S. 3rd) floor, with the best views on the house over the Firth of Forth to Fife. You will usually be able to relax in the elegant drawing room, and breakfast under the eye of family portraits in the ground floor dining room, enjoying home made bread and jams. The tides of Edinburgh family life will wash around the edges of your stay as you have the chance of an insight into what it is like to live in our wonderful city.hereo is";
  const words = text.split(" ");
  const wordLimit = 50;
  const showBtn = words.length > wordLimit;
  const displayText = isExpanded
    ? text
    : words.slice(0, wordLimit).join(" ") + (showBtn ? "..." : " ");
  return (
    <div className="w-[70%] pt-8">
      <h1 className="text-2xl">{data.description}</h1>
      <div className="bg-black opacity-10 w-full h-[1px] relative top-4"></div>
      <div className="flex gap-4 relative top-10">
        <img src={person} className="rounded-full  w-8 h-8" alt="" />
        <h1 className=" relative top-1 ">Hosted by</h1>
        <p className="relative top-1 font-medium">{data.id}</p>
      </div>
      <div className="bg-black opacity-10 w-full h-[1px] relative top-16"></div>
      <div className="relative top-20">
        <h1 className="font-medium mb-5 text-2xl">About our place</h1>
        <p className="text-justify text-slate-700">{displayText}</p>
        {showBtn && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className=" underline rounded-xl "
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      <div>
        <div className="bg-black opacity-10 w-full h-[1px] relative top-32"></div>
        <h1 className="relative top-40 font-medium mb-5 text-2xl">
          What place offers
        </h1>
        {col1.map((data) => (
          <div key={data.id} className="relative top-40 flex gap-5">
            <div className="mb-6">
              {" "}
              <img className="w-8  h-8" src={data.img} alt="" />
            </div>
            <div>
              {" "}
              <h1 className="font-thin text-[18px] relative top-1 text-slate-800">
                {data.title}
              </h1>
            </div>
            {/* {col2.map((data) => (
           
            ))} */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PdetailsSideBar;
