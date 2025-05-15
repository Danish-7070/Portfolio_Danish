import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';

const MatchCard = ({ match, onInterest, loading, setIsDialogOpen, isDialogOpen, comments, setComments}) => {
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


  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  }

  return (
    <div className="bg-gray-800 border relative border-gray-700 rounded-lg p-6 mb-6 shadow-lg transition duration-300 hover:shadow-xl">
      <div className="">
        {alreadyInterested && (
          <div className="flex items-center justify-end absolute top-1 right-1">
          <span className="top-1 ring-1  bg-green-500 text-white px-2 py-1 rounded">Interest Sent</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{match.bookingId.ground.name}</h3>
      <p>Request Maker: {match.matchMaker.username}</p>
      <p>Date: {new Date(match.bookingId.bookingDate).toLocaleDateString()}</p>
      <p>Time: {match.bookingId.bookingTime}</p>
      <p>Players Needed: {match.playersRequired}</p>
      {(onInterest && !approved && !rejected) && (
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={alreadyInterested}
          className={`mt-2 ${alreadyInterested ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-400'
            } text-white py-1 px-3 rounded`}
        >
          Express Interest
        </button>
      )}
      {approved && (
        <button
          className={`mt-2 bg-green-500 text-white py-1 px-3 rounded`}
        >
          Approved
        </button>
      )}
      {rejected && (
        <span className="top-1 ring-1 bg-red-500 text-white px-2 py-1 rounded">Rejected</span>
      )}
      {isDialogOpen && (
        <div className="modal modal-open ">
          <div className="modal-box bg-gray-500">
            <h1 className="text-2xl font-bold mb-4">Express Your Interest</h1>
            <form
              onSubmit={handleInterest}
              className="flex flex-col gap-4 text-black"
            >
              <label htmlFor="bookingDuration" className="text-white">

              </label>
              <textarea
                placeholder='Any comments'
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="input-bordered p-2 rounded-lg"
                rows={3}
              />

              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Expressing Interest..." : "Express Interest"}
              </button>
            </form>
            <div className="modal-action">
              <button
                onClick={handleDialogToggle}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default MatchCard;
