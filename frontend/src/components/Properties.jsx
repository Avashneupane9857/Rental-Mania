/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../config";
const PropertyCard = ({ property }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const preloadImages = () => {
      if (!property.imageSrc?.length) return;

      property.imageSrc.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () =>
          setLoadedImages((prev) => ({ ...prev, [index]: true }));
      });
    };

    preloadImages();
  }, [property.imageSrc]);

  const handleCardClick = () => {
    navigate(`/propertyDetails/${property.id}`);
  };

  const currentSrc = property.imageSrc?.[currentImage];
  const isImageLoaded = loadedImages[currentImage];
  const showControls = isImageLoaded && property.imageSrc?.length > 1;

  return (
    <div
      onClick={handleCardClick}
      className="relative top-28 w-[310px] cursor-pointer group"
    >
      <div className="relative">
        {!isImageLoaded || !currentSrc ? (
          <div className="w-[310px] h-72 rounded-2xl bg-gray-200 animate-pulse" />
        ) : (
          <img
            className="w-[310px] h-72 rounded-2xl object-cover"
            src={currentSrc}
            alt={property.title}
          />
        )}

        {showControls && currentImage > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((prev) =>
                prev === 0 ? property.imageSrc.length - 1 : prev - 1
              );
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border-2 rounded-full w-8 h-8 
                     flex justify-center items-center opacity-0 group-hover:opacity-100 
                     transition-all hover:scale-110 hover:shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
          </button>
        )}

        {showControls && currentImage < property.imageSrc.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((prev) => (prev + 1) % property.imageSrc.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border-2 rounded-full w-8 h-8 
                     flex justify-center items-center opacity-0 group-hover:opacity-100 
                     transition-all hover:scale-110 hover:shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
          </button>
        )}

        {showControls && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.imageSrc.map((_, index) => (
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
        )}
      </div>

      <div className="mt-3">
        <h1 className="font-medium">{property.title}</h1>
        <h1 className="text-slate-500 font-thin mt-1">{property.category}</h1>
        <div className="flex font-semibold mt-1 gap-1 items-center">
          <span className="font-normal">₹</span>
          <span className="font-normal">{property.price.toLocaleString()}</span>
          <span className="font-extralight">night</span>
        </div>
      </div>
    </div>
  );
};

function Properties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/property`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setProperties(data.property);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

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
