import React, { useState } from 'react';
import { useTeam } from '../../../context/teamContext';
import Tabs from './tabs';
import AvailableTeamReqs from './availableTeamReqs';
import ApprovedTeamReqs from './approvedTeamReqs';
import MyTeamReqs from './myTeamReqs';

const CustomerMatchRequests = () => {
    const { currTeam } = useTeam();
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className='bg-custom text-white min-h-screen flex flex-col'>
    {/* <div className='bg-gray-900 text-white min-h-screen flex flex-col'> */}
      <div className="flex-grow pt-2">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {activeTab === 'available' && <AvailableTeamReqs/>}
          {activeTab === 'approved' && <ApprovedTeamReqs currTeamId={currTeam.id} />}
          {activeTab === 'myTeamReqs' && <MyTeamReqs currTeamId={currTeam.id} />}
        </div>
      </div>
    </div>
  );
};

export default CustomerMatchRequests;
