import { Outlet, useNavigate } from "react-router-dom";
import React, { Children, createContext, useContext, useState } from "react";
import "./dashboardLayout.css";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from "../../components/chatList/ChatList";
import { MenuProvider, useMenu } from "../../components/MenuContext";

const DashboardLayout = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { isMenuOpen, toggleMenu } = useMenu();

  const handleSearch = () => {};
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      {isMenuOpen && (
        <div
          className={`menu shadow-md transition-all duration-1000 ease-in-out ml-${
            isMenuOpen ? "64" : "16"
          }`}
        >
          <ChatList />
        </div>
      )}

      <div
        className={`content flex-1 ${
          isMenuOpen ? "pl-4" : "pl-0"
        } transition-all duration-300`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
