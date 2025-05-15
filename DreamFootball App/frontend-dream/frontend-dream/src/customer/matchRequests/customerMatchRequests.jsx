import React, { useState } from 'react';
import { useUser } from '../../context/userContext';
import Tabs from './tabs';
import AvailableMatches from './availableMatches';
import ApprovedMatches from './approvedMatches';
import MyMatches from './myMatches';
import Navbar from '../../components/navbar/navbar';

const CustomerMatchRequests = () => {
  const { customer } = useUser();
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className='bg-custom text-white min-h-screen flex flex-col'>
    {/* <div className='bg-gray-900 text-white min-h-screen flex flex-col'> */}
      <Navbar />
      <div className="flex-grow pt-24">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {activeTab === 'available' && <AvailableMatches />}
          {activeTab === 'approved' && <ApprovedMatches customerId={customer.id} />}
          {activeTab === 'myMatches' && <MyMatches customerId={customer?.id} />}
        </div>
      </div>
    </div>
  );
};

export default CustomerMatchRequests;
