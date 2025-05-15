import React, { useState } from "react";
import AddNews from "./AddNews"; 
import ViewNews from "./ViewNews"; 

const NewsAdmin = () => {
  const [activeTab, setActiveTab] = useState("View News");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col max-w-[1400px] mx-auto">
      <div role="tablist" className="tabs sm:w-1/2 pt-4 w-full leading-tight tabs-boxed relative mx-auto gap-4 sm:mt-10 mt-20">
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "View News" ? "tab-active bg-green-700 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("View News")}
        >
          View News
        </a>
        <a
          role="tab"
          className={`tab btn ${
            activeTab === "Add News" ? "tab-active bg-green-700 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabClick("Add News")}
        >
          Add News
        </a>
      </div>

      <div className="p-4">
        {activeTab === "Add News" && <AddNews setActiveTab={setActiveTab}/>}
        {activeTab === "View News" && <ViewNews />}
      </div>
    </div>
  );
};

export default NewsAdmin;
