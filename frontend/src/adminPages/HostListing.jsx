import { useEffect, useState } from "react";
import ANavbar from "../adminComponents/ANavbar";
import axios from "axios";
import { backendUrl } from "../../config";

function HostListing() {
  const token = localStorage.getItem("authToken");
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const handleResponse = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/property/host/properties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setDatas(response.data.hostProperties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    handleResponse();
  }, [token]);

  return (
    <div className="px-11">
      <ANavbar />
      <h1 className="relative top-20 p-8 font-medium text-slate-700 text-2xl">
        Your Listings
      </h1>
      <div className="flex flex-wrap gap-8">
        {datas.map((data) => (
          <div className="w-[400px]" key={data.id}>
            <div className="relative top-20 rounded-lg bg-[#f7f7f7] w-[400px] h-[350px]">
              <img
                src={data.imageSrc[0] || "default-image-url.jpg"}
                width={400}
                height={350}
                alt={data.propertyName || "Property Image"}
                className="rounded-t-lg"
              />
              <p className="px-5 py-2">{data.locationName}</p>
              <p className="px-5 py-2">{data.propertyName}</p>
            </div>
            <div className="relative top-20 p-5 flex justify-between">
              <button
                className="text-red-600 border-[1px] w-16 hover:text-red-400 border-black rounded-lg"
                onClick={() => handleDelete(data.id)}
              >
                Delete
              </button>
              <button
                className="text-red-600 border-[1px] w-16 hover:text-red-400 border-black rounded-lg"
                onClick={() => handleEdit(data.id)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    axios
      .delete(`${backendUrl}/property/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert(response.data.msg || "Property deleted successfully!");

        setDatas((prevDatas) => prevDatas.filter((data) => data.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting property:", error);
        alert(
          error.response?.data?.msg ||
            "An error occurred while deleting the property."
        );
      });
  }

  // Function to handle edit
  function handleEdit(id) {
    console.log(`Edit property with ID: ${id}`);
    // Add your edit functionality here
  }
}

export default HostListing;
