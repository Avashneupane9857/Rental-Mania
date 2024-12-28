import AList from "../adminComponents/AList";

function AdminHero() {
  return (
    <div>
      <div className="flex justify-items-start gap-[810px]">
        <h1 className="text-2xl ">Welcome, Avash !</h1>
        <button className="bg-white hover:bg-[#EBEBEB] w-32 border-[1px] shadow-2xl rounded-3xl p-1">
          List Properties
        </button>
      </div>
      <div>
        <h1 className="text-xl top-16 relative">Your reservations</h1>
      </div>
      <div className="relative top-32 flex gap-4">
        <button className="border-[1px] rounded-2xl hover:bg-[#EBEBEB] h-10 w-36">
          Bookings
        </button>
        <button className="border-[1px] rounded-2xl hover:bg-[#EBEBEB] w-36">
          Currently hosting
        </button>
      </div>
      <div className="relative top-44">
        {" "}
        <AList />
      </div>
    </div>
  );
}

export default AdminHero;
