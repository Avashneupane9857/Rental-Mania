import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { prop3, prop5, prop6, prop7, prop8 } from "../assets";

// eslint-disable-next-line react/prop-types
const PropertyCard = ({ property }) => {
  const [currentImage, setCurrentImage] = React.useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.img.length);
  };

  const prevImage = () => {
    if (currentImage === 0) {
      setCurrentImage(property.img.length - 1);
    } else {
      setCurrentImage(currentImage - 1);
    }
  };

  return (
    <div className="relative top-20 w-[310px] cursor-pointer group">
      <div className="relative">
        <img
          className="w-[310px] h-72 rounded-2xl object-cover"
          src={property.img[currentImage]}
          alt={property.location}
        />

        {currentImage > 0 && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border-2 rounded-full w-8 h-8 
                     flex justify-center items-center opacity-0 group-hover:opacity-100 
                     transition-all hover:scale-110 hover:shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
          </button>
        )}

        {currentImage < property.img.length - 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border-2 rounded-full w-8 h-8 
                     flex justify-center items-center opacity-0 group-hover:opacity-100 
                     transition-all hover:scale-110 hover:shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
          </button>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {property.img.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 
                        ${
                          currentImage === index
                            ? "bg-white w-2.5"
                            : "bg-white/60"
                        }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3">
        <h1 className="font-medium">{property.location}</h1>
        <h1 className="text-slate-500 font-thin mt-1">200 kilometer away</h1>
        <div className="flex font-semibold mt-1 gap-1 items-center">
          <span className="font-normal">₹</span>
          <span className="font-normal">{property.Price.toLocaleString()}</span>
          <span className="font-extralight">night</span>
        </div>
      </div>
    </div>
  );
};

function Properties() {
  const propDetails = [
    {
      id: 0,
      img: [prop3, prop8, prop7, prop6],
      location: "Nandi Hills, Bangalore",
      Price: 32892,
    },
    {
      id: 1,
      img: [prop6, prop7, prop8, prop3],
      location: "Coorg Valley",
      Price: 28500,
    },
    {
      id: 2,
      img: [prop8, prop3, prop6, prop7],
      location: "Mysore Palace",
      Price: 45000,
    },
    {
      id: 2,
      img: [prop5, prop8, prop6, prop7],
      location: "Mysore Palace",
      Price: 45000,
    },
    {
      id: 2,
      img: [prop5, prop8, prop6, prop7],
      location: "Mysore Palace",
      Price: 45000,
    },
    {
      id: 19,
      img: [prop3, prop8, prop7, prop6],
      location: "Nandi Hills, Bangalore",
      Price: 32892,
    },
    {
      id: 21,
      img: [prop6, prop7, prop8, prop3],
      location: "Coorg Valley",
      Price: 28500,
    },
    {
      id: 22,
      img: [prop8, prop3, prop6, prop7],
      location: "Mysore Palace",
      Price: 45000,
    },
    {
      id: 12,
      img: [prop3, prop8, prop7, prop6],
      location: "Nandi Hills, Bangalore",
      Price: 32892,
    },
    {
      id: 11,
      img: [prop6, prop7, prop8, prop3],
      location: "Coorg Valley",
      Price: 28500,
    },
    {
      id: 10,
      img: [prop8, prop3, prop6, prop7],
      location: "Mysore Palace",
      Price: 45000,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {propDetails.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default Properties;
