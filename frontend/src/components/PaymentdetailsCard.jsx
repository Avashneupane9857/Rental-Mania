/* eslint-disable react/prop-types */
import { useState } from "react";
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

export const PaymentDetailsCard = ({ data, propertyId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReservation = async () => {
    if (!startDate || !endDate) {
      setError("Please select dates");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * data.price;
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${backendUrl}/reservations/create`, {
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
        }),
      });
      console.log(response.status);
      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (err) {
      setError(err.message || "Failed to create reservation");
    } finally {
      setIsLoading(false);
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
                onClick={() => setGuestCount(guestCount + 1)}
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
      </div>
    </div>
  );
};
