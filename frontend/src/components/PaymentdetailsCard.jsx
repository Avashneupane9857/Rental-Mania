/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { backendUrl } from "../../config";

const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
};

const DatePicker = ({ selectedDate, onDateSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const days = generateCalendarDays(currentYear, currentMonth);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isDisabled = (date) => {
    if (!date) return true;
    if (!minDate) return false;
    return date < minDate;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <div>
          {months[currentMonth]} {currentYear}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-sm font-medium py-1">
            {day}
          </div>
        ))}

        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => date && !isDisabled(date) && onDateSelect(date)}
            disabled={isDisabled(date)}
            className={`
              p-2 text-center rounded
              ${!date ? "invisible" : ""}
              ${isDisabled(date) ? "text-gray-300" : "hover:bg-gray-100"}
              ${
                selectedDate &&
                date &&
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-black text-white hover:bg-gray-800"
                  : ""
              }
            `}
          >
            {date ? date.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const PaymentDetailsCard = ({ data, propertyId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (totalPrice) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please login to make a reservation");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${backendUrl}/reservations/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            totalPrice,
            listingId: propertyId,
            startDate,
            endDate,
            guestCount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.msg || "Payment initialization failed"
        );
      }

      const { orderId, amount, currency, keyId } = data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Airbnb Clone",
        description: `Booking for ${data.title || "Property"}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const reservationResponse = await fetch(
              `${backendUrl}/reservations/create`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  startDate,
                  endDate,
                  totalPrice,
                  listingId: propertyId,
                  guestCount,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const reservationData = await reservationResponse.json();

            if (!reservationResponse.ok) {
              throw new Error(reservationData.msg || "Reservation failed");
            }

            setShowSuccess(true);
            setStartDate(null);
            setEndDate(null);
            setGuestCount(1);
          } catch (err) {
            setError(err.message || "Failed to complete reservation");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
        prefill: {
          name: "Guest",
          email: "guest@example.com",
        },
        theme: {
          color: "#fd5f7c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservation = async () => {
    if (!startDate || !endDate) {
      setError("Please select dates");
      return;
    }

    setIsLoading(true);
    setError("");

    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * data.price;

    try {
      await handlePayment(totalPrice);
    } catch (err) {
      setError("Payment failed");
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="w-full lg:w-[30%] px-4 md:px-0">
      <div className="max-w-sm mx-auto lg:ml-0 mt-8 lg:mt-10 bg-white border border-gray-200 p-6 shadow-xl rounded-2xl">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-medium">₹ {data.price}</h1>
          <p className="text-lg">night</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <button
              onClick={() => {
                setShowStartPicker(!showStartPicker);
                setShowEndPicker(false);
              }}
              className="w-full p-4 text-left border border-gray-500 rounded-lg"
            >
              {formatDate(startDate) || "Check-in date"}
            </button>
            {showStartPicker && (
              <div className="absolute z-10 mt-1">
                <DatePicker
                  selectedDate={startDate}
                  onDateSelect={(date) => {
                    setStartDate(date);
                    setShowStartPicker(false);
                  }}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowEndPicker(!showEndPicker);
                setShowStartPicker(false);
              }}
              className="w-full p-4 text-left border border-gray-500 rounded-lg"
            >
              {formatDate(endDate) || "Check-out date"}
            </button>
            {showEndPicker && (
              <div className="absolute z-10 mt-1">
                <DatePicker
                  selectedDate={endDate}
                  onDateSelect={(date) => {
                    setEndDate(date);
                    setShowEndPicker(false);
                  }}
                  minDate={startDate || new Date()}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border border-gray-500 rounded-lg p-4">
            <span>Guests</span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              >
                -
              </button>
              <span className="w-8 text-center">{guestCount}</span>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={() =>
                  setGuestCount(Math.min(data.guestCount || 10, guestCount + 1))
                }
              >
                +
              </button>
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        <button
          className={`w-full h-12 mt-8 text-white rounded-lg bg-[#fd5f7c]
            hover:bg-[#FF385C] transition-colors ${
              isLoading ? "opacity-50" : ""
            }`}
          onClick={handleReservation}
          disabled={isLoading || !startDate || !endDate}
        >
          {isLoading ? "Processing..." : "Reserve"}
        </button>

        {startDate && endDate && (
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Total nights:{" "}
              {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}
            </p>
            <p>
              Total price: ₹
              {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) *
                data.price}
            </p>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl max-w-sm w-full mx-4">
              <h3 className="text-2xl font-semibold mb-4">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-6">
                Thanks for your reservation. We are looking forward to hosting
                you!
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
