/* eslint-disable react/prop-types */
function PaymentdetailsCard({ data }) {
  return (
    <div className="w-[30%]  ">
      <div className="w-[350px] h-[450px] bg-white border-[1px] p-6 top-10 relative shadow-2xl border-slate-200 rounded-2xl">
        <div className="flex gap-1">
          {" "}
          <h1 className="text-xl font-sans font-medium">
            {" "}
            &#8377; {data.price}
          </h1>
          <p className="text-[17px] top-1 relative">night</p>
        </div>
        <div className="relative top-7 ">
          <div className="border-[1px] border-slate-500 rounded-t-lg w-72 h-14">
            <div className="bg-black "></div>
          </div>
          <div className="border-r border-b border-l rounded-b-lg border-slate-500  w-72 h-14"></div>
        </div>
        <button className="text-center text-white w-72  h-10 rounded-lg bg-[#ff5A5F] hover:bg-[#ff464c] relative top-20">
          Reserve
        </button>
      </div>
    </div>
  );
}

export default PaymentdetailsCard;
