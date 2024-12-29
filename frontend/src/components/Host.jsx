/* eslint-disable react/prop-types */
import { person } from "../assets";

function Host({ data }) {
  return (
    <div className="  relative">
      <h1 className="text-2xl">Meet your Host</h1>

      <div className="flex justify-center">
        {" "}
        <div className="bg-white w-[400px] flex  text-center p-8 h-60 rounded-2xl shadow-2xl">
          <div>
            <img
              src={person}
              className="w-[150px] h-[150px] rounded-full"
              alt=""
            />
            <h1 className="">{data.username}</h1>
          </div>
          <div className="pl-32">
            {" "}
            <h1 className="text-3xl">137</h1>
            <p className="text-[10px]">Reviews</p>
            <div className="h-[1.5px] relative top-2  w-[100%] bg-slate-400 opacity-30"></div>
            <h1 className="text-3xl pt-4">7</h1>
            <p className="text-[10px]">Year of hosting</p>
            <div className="h-[1.5px] relative top-2  w-[100%] bg-slate-400 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Host;
