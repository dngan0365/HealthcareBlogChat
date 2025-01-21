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

  const groupChatsByDate = (chats) => {
    if (!Array.isArray(chats) || chats.length === 0) {
      return {}; // Return an empty object if no chats
    }
    // Sort chats by created_at in descending order (newest first)
    chats.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const groupedChats = {};
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0)); // Reset time to midnight
    const yesterday = new Date(today);
    const sevenDaysAgo = new Date(today);
    const thirtyDaysAgo = new Date(today);
  
    yesterday.setDate(today.getDate() - 1); // Yesterday's date
    sevenDaysAgo.setDate(today.getDate() - 7); // Date 7 days ago
    thirtyDaysAgo.setDate(today.getDate() - 30); // Date 30 days ago

    chats.forEach((chat) => {
      const chatDate = new Date(chat.created_at);
      if (isNaN(chatDate)) {
        console.warn(`Invalid date for chat: ${chat._id}, skipping.`);
        return; // Skip if the date is invalid
      }
      
      console.log("chatdate ", chatDate)
      console.log("chatdate today ", today)
      let groupKey;
      
      console.log(today)
      if (chatDate >= today) {
        groupKey = "Today";
      } else if (chatDate >= yesterday && chatDate < today) {
        groupKey = "Yesterday";
      } else if (chatDate >= sevenDaysAgo) {
        groupKey = "Last 7 Days";
      } else if (chatDate >= thirtyDaysAgo) {
        groupKey = "Last 30 Days";
      } else {
        groupKey = chatDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }); // Group by month if older than 30 days
      }
  
      if (!groupedChats[groupKey]) {
        groupedChats[groupKey] = [];
      }
      groupedChats[groupKey].push(chat); // Add chat to the beginning for reversed order
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
        <div className="flex flex-col px-2">
          <span className="title">DASHBOARD</span>
          <div className="flex items-center hover:bg-hbg hover:cursor-pointer transition duration-200 ease-in-out rounded-lg p-2">
            <img
              src="/new_chat.svg"
              alt="Dashboard Icon"
              className="w-6 h-6 inline-block mr-2"
            />
            <Link to="/dashboard"><p className="chat-item chat-item text-lg font-medium">Create a new Chat</p></Link>
          </div>
          <div className="flex items-center hover:bg-hbg hover:cursor-pointer transition duration-200 ease-in-out rounded-lg p-2">
            <img
              src="/explore.svg"
              alt="Dashboard Icon"
              className="w-6 h-6 inline-block mr-2"
            />
            <Link to="/"><p className="chat-item text-lg font-medium" >Explore MedComp Blog</p></Link>
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

                    > <p className="chat-item text-lg font-medium">

                      {chat.title}
                    </p>
                    </Link>
                  ))}
                </div>
              ))
            ) : (
              <div className="no-chats text-gray-500 text-center py-4 chat-item text-lg font-medium">
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
