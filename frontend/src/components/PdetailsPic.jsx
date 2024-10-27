import { prop3, prop6, prop5, prop9 } from "../assets";

const PdetailsPic = () => {
  const images = [
    { id: 1, src: prop3, isMain: true },
    { id: 2, src: prop9 },
    { id: 3, src: prop6 },
    { id: 4, src: prop3 },
    { id: 5, src: prop5 },
  ];

  return (
    <div className="container mx-auto pt-24">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="md:w-1/2 relative group">
          <img
            src={images[0].src}
            alt="Property main view"
            className="w-full h-full object-cover rounded-l-xl"
          />
          <div className="absolute inset-0 rounded-l-xl bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        <div className="md:w-1/2 grid grid-cols-2 gap-2">
          {images.slice(1).map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.src}
                alt={`Property view ${index + 2}`}
                className={`
                  w-full h-48 object-cover
                  ${index === 2 || index === 3 ? "rounded-tr-xl" : ""}
                  ${index === 2 || index === 3 ? "rounded-br-xl" : ""}
                `}
              />
              <div
                className={`
                  absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  ${
                    index === 2 || index === 3
                      ? "rounded-tr-xl rounded-br-xl"
                      : ""
                  }
                `}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdetailsPic;
