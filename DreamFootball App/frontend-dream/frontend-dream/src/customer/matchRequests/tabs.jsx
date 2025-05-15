import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'available', label: 'Available Matches' },
    { id: 'approved', label: 'Approved Matches' },
    { id: 'myMatches', label: 'My Matches' },
  ];

  return (
    <div className="flex justify-center space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-2 rounded-lg transition-colors duration-300 
            ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'} 
            hover:bg-primary hover:text-white focus:outline-none`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
