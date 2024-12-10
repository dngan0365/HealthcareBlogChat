import React, { useState } from "react";

export default function SettingsCard(props) {
  // Tab State
  const [tab, setTab] = useState("one");

  // Gender Select Options
  const genderSelect = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  // Form State
  const [user, setUser] = useState({
    firstName: props.firstName,
    lastName: props.lastName,
    age: props.age,
    gender: props.gender,
    weight: props.weight,
    height: props.height,
  });

  const [edit, setEdit] = useState({
    required: true,
    disabled: true,
    isEdit: true,
  });

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const handleEditButton = (e) => {
    e.preventDefault();
    setEdit({
      ...edit,
      disabled: !edit.disabled,
      isEdit: !edit.isEdit,
    });

  };
  const handleSubmit = async (e) => {
    e.preventDefault();

  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "PATCH",
        credentials: "include", // Include cookies or tokens for authentication
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const result = await response.json();
      console.log("Profile updated successfully:", result);
      
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setEdit({
      ...edit,
      disabled: !edit.disabled,
      isEdit: !edit.isEdit,
    });

  };
  

  // Tabs Content
  const renderTabContent = () => {
    if (tab === "one") {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              disabled={edit.disabled}
              required={edit.required}
              className={`mt-2 block w-full rounded-md border-gray-300 shadow-sm ${
                edit.disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last & Middle Name
            </label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              disabled={edit.disabled}
              required={edit.required}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                edit.disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="Number"
              name="age"
              value={user.age}
              onChange={handleInputChange}
              disabled={edit.disabled}
              required={edit.required}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                edit.disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              disabled={edit.disabled}
              required={edit.required}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                edit.disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              {genderSelect.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <div className="flex items-center">
              <input
                type="Number"
                name="weight"
                placeholder="50"
                value={user.weight}
                onChange={handleInputChange}
                disabled={edit.disabled}
                required={edit.required}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                  edit.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
              />
              <span className="mr-2 text-gray-500">kg</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <div className="flex items-center">
              <input
                type="Number"
                name="height"
                value={user.height}
                placeholder="1.8"
                onChange={handleInputChange}
                disabled={edit.disabled}
                required={edit.required}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                  edit.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
              />
              <span className="mr-2 text-gray-500">m</span>
            </div>
          </div>
        
        </div>
      );
    }

    // Placeholder for other tabs
    return <div>Other Tab Content</div>;
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 shadow-md">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 pb-2 mb-4">
        <button
          className={`pb-1 ${
            tab === "one" ? "border-[#4CAF4F] border-b-2" : ""
          }`}
          onClick={() => setTab("one")}
        >
          Account
        </button>
        <button
          className={`pb-1 ${
            tab === "two" ? "border-[#4CAF4F] border-b-2" : ""
          }`}
          onClick={() => setTab("two")}
        >
          Saved Posts
        </button>

      </div>

      {/* Tab Content */}
      <form>
        {renderTabContent()}
        <div className="mt-6 text-right">
          <button
            type="button"
            className="bg-[#4CAF4F] text-white py-2 px-6 rounded-md"
            onClick={edit.isEdit ? handleEditButton : handleSubmit}
          >
            {edit.isEdit ? "Edit" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
