import React, { useState } from "react";
import { useEffect } from "react";
import ProfileCard from "../../components/Profile/ProfileCard";
import SettingsCard from "../../components/Profile/SettingsCard";
import { useAuth, useUser } from "@clerk/clerk-react";

const Profile = () => {
  const [text, setText] = useState("");
  const { isLoaded, isSignedIn } = useUser();
  const { user } = useUser();
  const userId = user?.id;

  // GET User Information
  
  
  // Default user object
  const defaultUser = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  };

  // State for user data
  const [mainUser, setMainUser] = useState(defaultUser);

  // Normalize backend data
  const normalizeUserData = (backendData) => {
    // Map backend fields to frontend fields and fallback to defaults
    return {
      firstName: backendData.firstname || defaultUser.firstName,
      lastName: backendData.lastname || defaultUser.lastName,
      username: backendData.username || defaultUser.username,
      email: backendData.email || defaultUser.email,
      age: backendData.age|| defaultUser.age, // Age not in backend; fallback to default
      gender: backendData.gender|| defaultUser.gender, // Gender not in backend; fallback to default
      weight: backendData.weight || defaultUser.weight, // Optional; fallback to default
      height: backendData.height || defaultUser.height, // Optional; fallback to default
    };
  };

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const backendData = await response.json();
      console.log("backend Data ", backendData[0]?.username)
      // Normalize and set user data
      setMainUser(normalizeUserData(backendData[0]));
      console.log("main user ", mainUser)
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Use default values if an error occurs
      setMainUser(defaultUser);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
     fetchUserData();
  }, []);

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login!</div>;
  }

  const fullName = `${mainUser.firstName} ${mainUser.lastName}`;
      return (
      <div className="bg-gray-100 min-h-screen">
        {/* Background Image */}
        <div className="relative">
          <img
            src="./cover-profile.jpg"
            alt="avatar"
            className="w-full h-[35vh] object-bottom object-center"
          />
          <div className="absolute inset-0 bg-slate-400 bg-opacity-20"></div>
        </div>
  
        {/* Main Content */}
        <div className="relative -mt-[15vh] px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Profile Card */}
            <div className="col-span-1">
              <ProfileCard
                name={fullName}
                dt1={mainUser.username}
                dt2={mainUser.email}
              />
            </div>
  
            {/* Settings Card */}
            <div className="col-span-3">
              <SettingsCard
                expose={(v) => setText(v)}
                firstName={mainUser.firstName}
                lastName={mainUser.lastName}
                age={mainUser.age}
                gender={mainUser.gender}
                weight={mainUser.weight}
                height={mainUser.height}
              />
            </div>
          </div>
        </div>
      </div>
    );
};

export default Profile;