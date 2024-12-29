import { person } from "../assets";

function Reviews() {
  const reviews = [
    {
      id: 7,
      img: person,
      name: "Trisheela",
      review:
        "I felt very welcome and at home at Daniela's place. She is a very kind host and I had a wonderful stay at her home!",
    },
    {
      id: 9,
      img: person,
      name: "Trisheela",
      review:
        "I felt very welcome and at home at Daniela's place. She is a very kind host and I had a wonderful stay at her home!",
    },
    {
      id: 1,
      img: person,
      name: "Trisheela",
      review:
        "I felt very welcome and at home at Daniela's place. She is a very kind host and I had a wonderful stay at her home!",
    },
    {
      id: 2,
      img: person,
      name: "Trisheela",
      review:
        "I felt very welcome and at home at Daniela's place. She is a very kind host and I had a wonderful stay at her home!",
    },
    {
      id: 3,
      img: person,
      name: "Trisheela",
      review:
        "I felt very welcome and at home at Daniela's place. She is a very kind host and I had a wonderful stay at her home!",
    },
    {
      id: 10,
      img: person,
      name: "Trisheela",
      review:
        "I felt very welcome and at home at Daniela's place. She is a very kind host and I had a wonderful stay at her home!",
    },
  ];

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-xl md:text-2xl font-sans font-medium mb-6">
        Reviews
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {reviews.map(({ id, img, name, review }) => (
          <div
            key={id}
            className="w-full bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={img}
                alt={`${name}'s profile`}
              />
              <p className="font-sans font-medium text-base md:text-lg">
                {name}
              </p>
            </div>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
