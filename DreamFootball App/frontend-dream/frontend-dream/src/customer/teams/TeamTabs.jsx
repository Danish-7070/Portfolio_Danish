import React, { useState } from "react";
import ViewCustomerTeams from "./viewCustomerTeams";
import TeamRequests from "./teamRequests/teamRequests";


const TeamTabs = () => {
  const [activeTab, setActiveTab] = useState("View Teams");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col">
      <div role="tablist" className="tabs sm:w-1/2  w-full leading-tight tabs-boxed relative mx-auto gap-4 ">
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "View Teams"
              ? " bg-red-500 text-white"
              : "bg-gray-500 text-white"
          }`}
          onClick={() => handleTabClick("View Teams")}
        >
          View Teams
        </a>
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "Team Requests"
              ? " bg-red-500 text-white"
              : "bg-gray-500 text-white"
          }`}
          onClick={() => handleTabClick("Team Requests")}
        >
          Team Requests
        </a>
      </div>

      <div className=" p-4">
        {/* Render tab content based on the active tab */}
        {activeTab === "View Teams" && <ViewCustomerTeams/>}
        {activeTab === "Team Requests" && <TeamRequests/>}
      </div>
    </div>
  );
};

export default TeamTabs;
