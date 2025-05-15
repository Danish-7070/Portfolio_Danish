import React, { useState } from 'react';
import AddLeague from './addLeague';
import ViewAllLeagues from './viewAllLeagues';


const AdminLeagues = () => {
    const [activeTab, setActiveTab] = useState('View Leagues');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='flex flex-col max-w-[1400px] mx-auto'>
            <div role="tablist" className="tabs tabs-boxed sm:w-1/2 pt-4 w-full leading-tight mx-auto gap-4 sm:mt-10 mt-20">
                <a
                    role="tab"
                    className={`tab btn ${activeTab === 'Add League' ? 'tab-active bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => handleTabClick('Add League')}
                >
                    Add League
                </a>
                <a
                    role="tab"
                    className={`tab btn ${activeTab === 'View Leagues' ? 'tab-active bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => handleTabClick('View Leagues')}
                >
                    View Leagues
                </a>
            </div>

            <div className="p-4">
                {activeTab === 'Add League' && <AddLeague setActiveTab={setActiveTab} />}
                {activeTab === 'View Leagues' && <ViewAllLeagues />}
            </div>
        </div>
    );
};

export default AdminLeagues;
