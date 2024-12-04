import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useMenu } from "../MenuContext";

const ChatList = () => {
  const { isMenuOpen, toggleMenu } = useMenu();
  console.log(isMenuOpen);

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

  const handleSearch = () => {};

  return (
    <div className="chatList">
      <div>
        {/* Button to close the menu */}
        <div className="icon">
          <span className="close" onClick={toggleMenu}>
            <button className="closeMenuButton" onClick={toggleMenu}></button>
          </span>
          <span className="close" onClick={handleSearch}>
            <button className="search" onClick={handleSearch}></button>
          </span>
        </div>

        {/* Menu content */}
        <div className="flex  flex-col px-1">
          <span className="title">DASHBOARD</span>
          <Link to="/dashboard">Create a new Chat</Link>
          <Link to="/">Explore MedComp Blog</Link>
          <hr />
          <span className="title">ALL CHATS</span>
          <div className="list">
            {isLoading ? (
              "Loading..."
            ) : error ? (
              "Something went wrong!"
            ) : data?.message ? (
              <p>{data.message}</p> // Display custom message if `data.message` exists
            ) : data?.length > 0 ? (
              data
                .slice()
                .reverse()
                .map((chat) => (
                  <Link
                    className="hover:bg-[#eafdf3] hover:text-gray-600 transition duration-200"
                    to={`/dashboard/chats/${chat._id}`}
                    key={chat._id}
                  >
                    {chat.title}
                  </Link>
                ))
            ) : (
              <p>No chats available.</p> // Fallback for empty data
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
