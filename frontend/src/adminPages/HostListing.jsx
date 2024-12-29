import { useEffect, useState } from "react";
import ANavbar from "../adminComponents/ANavbar";
import axios from "axios";
import { backendUrl } from "../../config";
import { useNavigate } from "react-router-dom";

function HostListing() {
  const navigate = useNavigate();
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

  function handleEdit(id) {
    console.log(`Edit property with ID: ${id}`);
    navigate(`/hosting/property/edit/${id}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <ANavbar />
      <div className="px-6 pt-24 pb-12">
        <h1 className="font-medium text-slate-700 text-2xl mb-8">
          Your Listings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {datas.map((data) => (
            <div key={data.id} className="flex flex-col">
              <div className="bg-[#f7f7f7] rounded-lg overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img
                    src={data.imageSrc[0] || "default-image-url.jpg"}
                    alt={data.propertyName || "Property Image"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 font-medium">
                    {data.locationName}
                  </p>
                  <p className="text-gray-600 mt-1">{data.propertyName}</p>
                </div>
              </div>

              <div className="flex justify-between mt-4 gap-4">
                <button
                  onClick={() => handleDelete(data.id)}
                  className="flex-1 px-4 py-2 text-red-600 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(data.id)}
                  className="flex-1 px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HostListing;
