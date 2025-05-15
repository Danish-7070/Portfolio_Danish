import React, { useEffect, useState } from 'react';
import { useTeam } from '../../../../context/teamContext';

const TeamRequestCard = ({ request, onInterest, loading, setIsDialogOpen, isDialogOpen, comments, setComments }) => {
  const [alreadyInterested, setAlreadyInterested] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const { currTeam: team } = useTeam();

  useEffect(() => {
    if (request && team) {
      const interestedTeams = request.interestedTeams;
      const isAlreadyInterested = interestedTeams.map(team => team.team._id).includes(team._id);
      setAlreadyInterested(isAlreadyInterested);
      const isApproved = interestedTeams.map(team => team.requestStatus).includes('approved');
      setApproved(isApproved);
      const isRejected = interestedTeams.map(team => team.requestStatus).includes('rejected');
      setRejected(isRejected);
    }
  }, [request, team]);

  const handleInterest = () => {
    if (onInterest) {
      onInterest(request);
    }
  };

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div className="bg-customDark2 border relative rounded-lg p-6 mb-6 shadow-lg transition duration-300 hover:shadow-xl">
    {/* <div className="bg-gray-800 border relative rounded-lg p-6 mb-6 shadow-lg transition duration-300 hover:shadow-xl"> */}
      <div>
        {alreadyInterested && (
          <div className="flex items-center justify-end absolute top-1 right-1">
            <span className="top-1 ring-1 bg-green-700 text-white px-2 py-1 rounded">Interest Sent</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{request.bookingId.ground.name}</h3>
      <p>Request Maker: {request.matchMaker.teamName}</p> {/* Assuming team has a name field */}
      <p>Date: {new Date(request.bookingId.bookingDate).toLocaleDateString()}</p>
      <p>Time: {request.bookingId.bookingTime}</p>
      
      {(onInterest && !approved && !rejected) && (
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={alreadyInterested}
          className={`mt-2 ${alreadyInterested ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-400'} text-white py-1 px-3 rounded`}
        >
          Express Interest
        </button>
      )}
      
      {approved && (
        <button className="mt-2 bg-green-700 text-white py-1 px-3 rounded">
          Approved
        </button>
      )}
      
      {rejected && (
        <span className="top-1 ring-1 bg-red-500 text-white px-2 py-1 rounded">Rejected</span>
      )}

      {isDialogOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-500">
            <h1 className="text-2xl font-bold mb-4">Express Team Interest</h1>
            <form onSubmit={handleInterest} className="flex flex-col gap-4 text-black">
              <textarea
                placeholder="Any comments for the team match?"
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
                {loading ? "Expressing Interest..." : "Express Team Interest"}
              </button>
            </form>
            <div className="modal-action">
              <button onClick={handleDialogToggle} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRequestCard;