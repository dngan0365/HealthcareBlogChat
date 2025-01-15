import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useMenu } from "../MenuContext";
import { useState } from "react";

const ChatList = () => {
  const { isMenuOpen, toggleMenu } = useMenu();
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Fetch user chats using React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ["userChats"], // Unique key for this query
    queryFn: async () =>
      fetch(`${import.meta.env.VITE_API_URL}/chats/userchats`, {
        credentials: "include", // Include credentials (cookies, auth tokens)
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });

  // Safely process `data`
  const groupChatsByDate = (chats) => {
    if (!Array.isArray(chats) || chats.length === 0) {
      return {}; // Trả về đối tượng rỗng nếu không có chat
    }

    const groupedChats = {};
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    const thirtyDaysAgo = new Date(today);

    sevenDaysAgo.setDate(today.getDate() - 7); // Ngày 7 ngày trước
    thirtyDaysAgo.setDate(today.getDate() - 30); // Ngày 30 ngày trước

    chats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);
      if (isNaN(chatDate)) {
        console.warn(`Invalid date for chat: ${chat._id}, skipping.`);
        return; // Bỏ qua nếu ngày không hợp lệ
      }

      let groupKey;

      if (chatDate >= sevenDaysAgo) {
        groupKey = "Last 7 Days";
      } else if (chatDate >= thirtyDaysAgo) {
        groupKey = "Last 30 Days";
      } else {
        groupKey = chatDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }); // Theo tháng nếu hơn 30 ngày
      }

      if (!groupedChats[groupKey]) {
        groupedChats[groupKey] = [];
      }
      groupedChats[groupKey].push(chat);
    });

    return groupedChats;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;

  const sortedChats = Array.isArray(data)
    ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []; // Ensure `sortedChats` is an array

  const groupedChats = groupChatsByDate(sortedChats);

  return (
    <div className="chatList">
      <div>
        {/* Button to close the menu */}
        <div className="icon">
          <span className="close" onClick={toggleMenu}>
            <button className="closeMenuButton" onClick={toggleMenu}></button>
          </span>
          <span className="close">
            <button className="search"></button>
          </span>
        </div>

        {/* Menu content */}
        <div className="flex flex-col px-1">
          <span className="title">DASHBOARD</span>
          <div className="flex items-center">
            <img
              src="/new_chat.svg"
              alt="Dashboard Icon"
              className="w-6 h-6 inline-block mr-2"
            />
            <Link to="/dashboard">Create a new Chat</Link>
          </div>
          <div className="flex items-center">
            <img
              src="/explore.svg"
              alt="Dashboard Icon"
              className="w-6 h-6 inline-block mr-2"
            />
            <Link to="/">Explore MedComp Blog</Link>
          </div>
          <hr />
          <span className="title">ALL CHATS</span>
          <div className="list">
            {Object.keys(groupedChats).length > 0 ? (
              Object.keys(groupedChats).map((dateKey) => (
                <div key={dateKey} className="group">
                  <div className="group-title font-bold text-gray-700 my-2">
                    {dateKey}
                  </div>
                  {groupedChats[dateKey].map((chat) => (
                    <Link
                      className={`block py-1 hover:bg-gray-200 rounded-md transition duration-200
                        ${chat._id === selectedChatId ? "bg-[rgba(0,0,0,0.15)]" : ""}`}
                      to={`/dashboard/chats/${chat._id}`}
                      key={chat._id}
                      onClick={() => setSelectedChatId(chat._id)}
                    >
                      {chat.title}
                    </Link>
                  ))}
                </div>
              ))
            ) : (
              <div className="no-chats text-gray-500 text-center py-4">
                No chats available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
