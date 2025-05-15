import React, { useState } from "react";
import ViewTeams from "./viewTeams";
import AddTeams from "./addTeams";
import EditTeams from "./editTeams";

const Teams = () => {
  const [activeTab, setActiveTab] = useState("View Teams");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col max-w-[1400px] mx-auto">
      <div role="tablist" className="tabs sm:w-1/2 pt-4 w-full leading-tight tabs-boxed relative mx-auto gap-4 sm:mt-10 mt-20">
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "View Teams"
              ? "tab-active bg-green-700 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("View Teams")}
        >
          View Teams
        </a>
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "Edit Teams"
              ? "tab-active bg-green-700 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("Edit Teams")}
        >
          Edit Teams
        </a>
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "Add Teams"
              ? "tab-active bg-green-700 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("Add Teams")}
        >
          Add Teams
        </a>
      </div>

      <div className=" p-4">
        {/* Render tab content based on the active tab */}
        {activeTab === "Add Teams" && <AddTeams setActiveTab={setActiveTab}/>}
        {activeTab === "Edit Teams" && <EditTeams/>}
        {activeTab === "View Teams" && <ViewTeams/>}
      </div>
    </div>
  );
};

export default Teams;
