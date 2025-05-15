import React, { useState } from 'react'
import AddChallenge from './addChallenge';
import ViewAllChallenges from './viewAllChallenges';

const Challenges = () => {
    const [activeTab, setActiveTab] = useState('Add Challenge');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='flex flex-col max-w-[1400px] mx-auto'>
            <div role="tablist" className="tabs sm:w-1/2 pt-4 w-full leading-tight tabs-boxed  mx-auto gap-4 mt-10">
                <a
                    role="tab"
                    className={`tab btn ${activeTab === 'Add Challenge' ? 'tab-active bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => handleTabClick('Add Challenge')}
                >
                    Add Challenge
                </a>
                <a
                    role="tab"
                    className={`tab btn ${activeTab === 'View Challenges' ? 'tab-active bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => handleTabClick('View Challenges')}
                >
                    View Challenges
                </a>
                <a
                    role="tab"
                    className={`tab btn ${activeTab === 'See Registrations' ? 'tab-active bg-green-700 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => handleTabClick('See Registrations')}
                >
                    See Registrations
                </a>
            </div>

            <div className=" p-4">
                {activeTab === 'Add Challenge' && <AddChallenge />}
                {activeTab === 'View Challenges' && <ViewAllChallenges />}
                {activeTab === 'See Registrations' && "see registrations"}
            </div>
        </div>
    )
}

export default Challenges
