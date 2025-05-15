import React, { useState } from "react";
import AddGround from "./addGround";
import RemoveGround from "./removeGround";
import EditGround from "./editGround";
import dfawallpaper from "../../assets/dfa-wallpaper.png";

const Ground = () => {
  const [activeTab, setActiveTab] = useState("Add Ground"); // Initial active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col max-w-[1400px] mx-auto" >
      <div role="tablist" className="tabs tabs-boxed sm:w-1/2 pt-4 w-full mx-auto  gap-4 mt-20 sm:mt-10">
        <a
          role="tab"
          className={`tab btn leading-tight ${
            activeTab === "Remove Ground"
              ? "tab-active bg-green-700 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("Remove Ground")}
        >
          View Grounds
        </a>
        <a
          role="tab"
          className={`tab btn leading-tight ${
            activeTab === "Edit Ground"
              ? "tab-active bg-green-700 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("Edit Ground")}
        >
          Edit Ground
        </a>
        <a
          role="tab"
          className={`tab btn leading-tight ${
            activeTab === "Add Ground"
              ? "tab-active bg-green-700 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("Add Ground")}
        >
          Add Ground
        </a>
      </div>

      <div className=" p-4">
        {/* Render tab content based on the active tab */}
        {activeTab === "Add Ground" && <AddGround setActiveTab={setActiveTab} />}
        {activeTab === "Edit Ground" && <EditGround />}
        {activeTab === "Remove Ground" && <RemoveGround />}
      </div>
    </div>
  );
};

export default Ground;
