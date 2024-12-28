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
    <div className="relative top-96">
      <h1 className="text-2xl h-10 font-sans ">Reviews</h1>
      <div className="grid gap-5 grid-cols-2 ">
        {reviews.map(({ id, img, name, review }) => (
          <div key={id} className=" w-[80%] relative top-2">
            <div className="flex  gap-2">
              <img className="w-12 h-12 rounded-full  " src={img} alt="" />
              <p className="font-sans font-medium relative top-2 ">{name}</p>
            </div>
            <p className="relative top-2">{review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
