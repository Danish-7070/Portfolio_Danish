import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';

const ApprovedMatchCard = ({ match, onInterest }) => {
  const [alreadyInterested, setAlreadyInterested] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const { customer } = useUser();

  useEffect(() => {
    if (match && customer) {
      console.log('match', match);
      const interestedPlayers = match.interestedPlayers;
      const isAlreadyInterested = interestedPlayers.map(player => player.player._id).includes(customer._id);
      setAlreadyInterested(isAlreadyInterested);
      const isapproved = interestedPlayers.map(player => player.requestStatus).includes('approved');
      setApproved(isapproved);
      const isRejected = interestedPlayers.map(player => player.requestStatus).includes('rejected');
      setRejected(isRejected);
    }
  }, [match, customer]); // Add dependencies

  const handleInterest = () => {
    if (onInterest) {
      onInterest(match); // Pass the match to the onInterest function
    }
  };

  return (
    // <div className="p-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="p-6 bg-customDark2 text-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2">{match.bookingId.ground.name}</h3>
      <p className="text-sm mb-1"><span className="font-semibold">Request Maker:</span> {match.matchMaker.username}</p>
      <p className="text-sm mb-1"><span className="font-semibold">Date:</span> {new Date(match.bookingId.bookingDate).toLocaleDateString()}</p>
      <p className="text-sm mb-1"><span className="font-semibold">Time:</span> {match.bookingId.bookingTime}</p>
      <p className="text-sm mb-1"><span className="font-semibold">Players Needed:</span> {match.playersRequired}</p>
      <div className="flex items-center justify-end mt-4">
        {approved && (
          <span className="text-white font-semibold text-sm rounded-lg bg-green-500 py-1 px-3">
            Approved
          </span>
        )}
      </div>
      <p className='text-gray-200 mt-2 text-center'><span className='font-semibold'>Note:</span> IF NOT COME YOUR ACCOUNT WILL BE BLOCKED</p>
    </div>
  );
};

export default ApprovedMatchCard;
