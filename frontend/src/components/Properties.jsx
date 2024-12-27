/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../../config";

const PropertyCard = ({ property }) => {
  const [currentImage, setCurrentImage] = useState(0);

  console.log("Property data:", property);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.imageSrc.length);
  };

  const prevImage = () => {
    if (currentImage === 0) {
      setCurrentImage(property.imageSrc.length - 1);
    } else {
      setCurrentImage(currentImage - 1);
    }
  };

  const images = Array.isArray(property.imageSrc) ? property.imageSrc : [];
  const currentImageUrl = images[currentImage] || "";

  return (
    <div className="relative top-20 w-[310px] cursor-pointer group">
      <div className="relative">
        {images.length > 0 ? (
          <>
            <img
              className="w-[310px] h-72 rounded-2xl object-cover"
              src={currentImageUrl}
              alt={property.title}
              onError={(e) => {
                console.error("Image failed to load:", currentImageUrl);
                e.target.src = "/placeholder-image.jpg"; // Add a placeholder image
              }}
            />

            {currentImage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border-2 rounded-full w-8 h-8 
                         flex justify-center items-center opacity-0 group-hover:opacity-100 
                         transition-all hover:scale-110 hover:shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
              </button>
            )}

            {currentImage < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border-2 rounded-full w-8 h-8 
                         flex justify-center items-center opacity-0 group-hover:opacity-100 
                         transition-all hover:scale-110 hover:shadow-lg"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
              </button>
            )}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
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
          </>
        ) : (
          <div className="w-[310px] h-72 rounded-2xl bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h1 className="font-medium">{property.title}</h1>
        <p className="text-slate-500 font-thin mt-1">
          {property.description?.substring(0, 30)}...
        </p>
        <div className="flex font-semibold mt-1 gap-1 items-center">
          <span className="font-normal">₹</span>
          <span className="font-normal">
            {property.price?.toLocaleString()}
          </span>
          <span className="font-extralight">night</span>
        </div>
      </div>
    </div>
  );
};

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${backendUrl}/property`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.property) {
          setProperties(response.data.property);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.response?.data?.msg || "Failed to fetch properties");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default Properties;
