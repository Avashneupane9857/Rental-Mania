/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../config";

const AdminHero = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const filter =
          activeTab === "bookings"
            ? ""
            : `?filter=${activeTab === "currently" ? "current" : "upcoming"}`;
        const response = await axios.get(
          `${backendUrl}/reservations/host${filter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservations(response.data.reservations);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
        console.error("Failed to fetch reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [activeTab, navigate]);

  const TabButton = ({ label, value }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`border rounded-2xl px-6 py-2.5 transition-colors ${
        activeTab === value ? "bg-black text-white" : "hover:bg-[#EBEBEB]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, Avash !</h1>
        <button
          onClick={() => navigate("/become-a-host")}
          className="bg-white hover:bg-[#EBEBEB] px-6 py-2.5 border shadow-sm rounded-3xl transition-colors"
        >
          List Properties
        </button>
      </div>

      <h2 className="text-xl font-medium mb-6">Your reservations</h2>

      <div className="space-x-4 mb-8">
        <TabButton label="Bookings" value="bookings" />
        <TabButton label="Currently hosting" value="currently" />
        <TabButton label="Upcoming" value="upcoming" />
      </div>

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
                      Guest: {reservation.user.firstName}{" "}
                      {reservation.user.lastName}
                    </p>
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHero;
