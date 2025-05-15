import React, { useEffect, useState } from 'react';
import { useTeam } from '../../../../context/teamContext';

const ApprovedTeamRequestCard = ({ request }) => {
  const [alreadyInterested, setAlreadyInterested] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const { currTeam } = useTeam();

  useEffect(() => {
    if (request && currTeam) {
      console.log('request', request);
      const interestedTeams = request.interestedTeams;
      const isAlreadyInterested = interestedTeams.map(team => team.team._id).includes(currTeam._id);
      setAlreadyInterested(isAlreadyInterested);
      const isApproved = interestedTeams.map(team => team.requestStatus).includes('approved');
      setApproved(isApproved);
      const isRejected = interestedTeams.map(team => team.requestStatus).includes('rejected');
      setRejected(isRejected);
    }
  }, [request, currTeam]);

  return (
    <div className="p-6 bg-customDark2 text-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    {/* <div className="p-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"> */}
      <h3 className="text-xl font-semibold mb-2">{request.bookingId.ground.name}</h3>
      <p className="text-sm mb-1">
        <span className="font-semibold">Request Maker:</span> {request.matchMaker.name}
      </p>
      <p className="text-sm mb-1">
        <span className="font-semibold">Date:</span>{' '}
        {new Date(request.bookingId.bookingDate).toLocaleDateString()}
      </p>
      <p className="text-sm mb-1">
        <span className="font-semibold">Time:</span> {request.bookingId.bookingTime}
      </p>
      <p className="text-sm mb-1">
        <span className="font-semibold">Opponent Team:</span>{' '}
        {request.matchMaker._id === currTeam._id 
          ? request.interestedTeams.find(team => team.requestStatus === 'approved')?.team.name
          : request.matchMaker.name
        }
      </p>
      <div className="flex items-center justify-end mt-4">
        {approved && (
          <span className="text-white font-semibold text-sm rounded-lg bg-green-500 py-1 px-3">
            Match Confirmed
          </span>
        )}
      </div>
      <div className="bg-gray-200 rounded-md p-2 text-black mt-2">
        <p className='text-center'>
        TRANSFER PAYMENT TO THE EASYPAISA NUMBER AND SAVE SCREENSHOT TO SHOW AT ENTRANCE
        </p>
        <p className="text-center font-bold">03215259146</p>
      </div>
    </div>
  );
};

export default ApprovedTeamRequestCard;
