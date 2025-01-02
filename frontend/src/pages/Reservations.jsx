import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../config";
import { useNavigate } from "react-router-dom";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handlePropertiesDetails = (id) => {
    navigate(`/propertyDetails/${id} `);
  };
  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${backendUrl}/reservations/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data.reservations);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-8">Your trips</h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                <img
                  src={
                    reservation.listing.imageSrc[0] ||
                    "/api/placeholder/200/200"
                  }
                  alt={reservation.listing.title}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">
                    {reservation.listing.title}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      Check-in:{" "}
                      {new Date(reservation.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      Check-out:{" "}
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </p>
                    <p className="font-medium text-black">
                      Total: ${reservation.totalPrice}
                    </p>
                    <p className="text-sm">
                      {reservation.listing.locationName}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        handlePropertiesDetails(reservation.listingId)
                      }
                      className="text-sm underline hover:text-gray-700"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reservations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No trips booked yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reservations;
