import { useState } from "react";

const MessagePage = () => {
  const [filter, setFilter] = useState("All");

  const messages = [
    {
      id: "1",
      sender: "Shravanth, Trisheela",
      content: "98861 23366 is my WhatsApp number",
      timestamp: "8:17 AM",
      isHost: true,
      avatar: "/api/placeholder/40/40",
    },
    {
      id: "2",
      sender: "Shravanth, Trisheela",
      content: "You can send me a msg",
      timestamp: "8:18 AM",
      isHost: true,
      avatar: "/api/placeholder/40/40",
    },
    {
      id: "3",
      sender: "Shravanth, Trisheela",
      content: "I'll share all details",
      timestamp: "8:19 AM",
      isHost: true,
      avatar: "/api/placeholder/40/40",
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-96 border-r">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-full ${
                filter === "All" ? "bg-black text-white" : "bg-gray-100"
              }`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                filter === "Unread" ? "bg-black text-white" : "bg-gray-100"
              }`}
              onClick={() => setFilter("Unread")}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex gap-3">
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{msg.sender}</h3>
                    <span className="text-sm text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/api/placeholder/40/40"
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-medium">Shravanth, Trisheela</h2>
                <p className="text-sm text-gray-500">Translation on</p>
              </div>
            </div>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Show reservation
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4">
              <div className="flex items-start gap-3">
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-gray-100 rounded-2xl p-3 max-w-[70%]">
                  <p>{msg.content}</p>
                </div>
              </div>
              <div className="ml-11 mt-1 text-sm text-gray-500 flex items-center gap-2">
                {msg.timestamp}
                {msg.isRead && <span>• Read</span>}
                {msg.isEdited && <span>• Edited</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2 border rounded-lg p-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 outline-none"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Typical response time: 3 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
