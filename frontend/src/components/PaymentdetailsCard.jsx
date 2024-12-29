/* eslint-disable react/prop-types */
export const PaymentdetailsCard = ({ data }) => {
  return (
    <div className="w-full lg:w-[30%] px-4 md:px-0">
      <div className="max-w-sm mx-auto lg:ml-0 mt-8 lg:mt-10 bg-white border border-slate-200 p-6 shadow-2xl rounded-2xl">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-medium">&#8377; {data.price}</h1>
          <p className="text-lg">night</p>
        </div>

        <div className="mt-6">
          <div className="border border-slate-500 rounded-t-lg p-4 h-14">
            {/* Check-in date picker */}
          </div>
          <div className="border-r border-b border-l border-slate-500 rounded-b-lg p-4 h-14">
            {/* Check-out date picker */}
          </div>
        </div>

        <button className="w-full h-10 mt-8 text-white rounded-lg bg-[#ff5A5F] hover:bg-[#ff464c] transition-colors">
          Reserve
        </button>
      </div>
    </div>
  );
};
