import { ChevronRight } from "lucide-react";
import { prop3, prop6, prop7, prop8 } from "../assets";
import { useState } from "react";

function Properties() {
  const propDetails = [
    {
      id: 0,
      img: [prop3, prop8, prop7, prop6],
      location: "Nandi Hills",
      Price: 32892,
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (id) => {
    setCurrentImage((prev) => (prev + 1) % propDetails[id].img.length);
  };

  // const prevImage = () => {
  //   setCurrentImage(
  //     (prev) => (prev - 1 + propDetails[0].img.length) % propDetails.length
  //   );
  // };
  return (
    <div className="">
      {" "}
      <div className="relative top-20 w-[25%] cursor-pointer group">
        <div>
          {propDetails.map((e) => (
            <>
              <img
                key={e.id}
                className="w-[310px] h-72 rounded-2xl"
                src={e.img[currentImage]}
                alt="Properties"
              />
              <button
                onClick={() => nextImage(e.id)}
                className="relative bottom-40 group-hover:opacity-100 opacity-0 left-64 bg-white border-2 rounded-full w-8 h-8 flex justify-center transition-transform items-center hover:scale-110 hover:shadow-lg "
              >
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900 " />
              </button>
            </>
          ))}
        </div>
        <div className="mt-[-15px]">
          <h1 className="relative top-2 font-medium">Nandi Hills, Banglore</h1>
          <h1 className="text-slate-500 font-thin relative top-3">
            200 kilometer away
          </h1>
          <div className="flex font-semibold relative top-3 gap-1">
            <h1 className="font-normal relative  "> &#8377;</h1>
            <h1 className="font-normal "> 39,255</h1>
            <p className="font-extralight">night</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Properties;

/*
img
location
Pirce
*/
