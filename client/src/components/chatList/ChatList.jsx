import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useMenu } from "../MenuContext";

const ChatList = () => {
  const { isMenuOpen, toggleMenu } = useMenu();

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
      return {}; // Return an empty object if `chats` is not an array or is empty
    }

    const groupedChats = {};
    const today = new Date();

    chats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);
      if (isNaN(chatDate)) {
        console.warn(`Invalid date for chat: ${chat._id}, skipping.`);
        return; // Skip invalid dates
      }

      const isToday = chatDate.toDateString() === today.toDateString();
      const isYesterday =
        chatDate.toDateString() ===
        new Date(today.setDate(today.getDate() - 1)).toDateString();

      const groupKey = isToday
        ? "Today"
        : isYesterday
        ? "Yesterday"
        : chatDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

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
          <Link to="/dashboard">Create a new Chat</Link>
          <Link to="/">Explore MedComp Blog</Link>
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
                      className="block py-1 hover:bg-gray-200 rounded-md transition duration-200"
                      to={`/dashboard/chats/${chat._id}`}
                      key={chat._id}
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
