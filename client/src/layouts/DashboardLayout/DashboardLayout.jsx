import { Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./dashboardLayout.css";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from "../../components/chatList/ChatList";

const DashboardLayout = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
  {
    isMenuOpen && (
      <div
        className={`menu transition-all duration-300 ${isMenuOpen ? "w-64" : "w-0"}`}
      >
        <ChatList isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    )
  }

  <div className={`content flex-1 ${isMenuOpen ? "pl-4" : "pl-0"} transition-all duration-300`}>
    {!isMenuOpen && (
      <button
        className="openMenuButton bg-blue-500 text-white p-2 rounded fixed top-4 left-4"
        onClick={toggleMenu}
      >
        Open Menu
      </button>
    )}
    <Outlet />
  </div>
</div>

  )
  
};

export default DashboardLayout;
