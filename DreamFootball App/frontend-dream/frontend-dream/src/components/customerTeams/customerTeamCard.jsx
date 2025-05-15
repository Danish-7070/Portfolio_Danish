import React from "react";
import { FaTrophy } from "react-icons/fa";

const CustomerTeamCard = ({ team, challenges, selfId, onOpenChallenge }) => {
  const checkIfChallenged = () => {
    console.log("Challenges:", challenges);
    const challenge = challenges.find(
      (challenge) =>
        challenge.challengerTeam._id === selfId &&
        challenge.challengedTeam._id === team._id
    );
    console.log("Challenge:", challenge);
    return challenge;
  };

  const checkIfChallengeAccepted = () => {
    console.log("Challenges:", challenges);
    const challenge = challenges.find(
      (challenge) =>
        challenge.challengerTeam._id === selfId &&
        challenge.challengedTeam._id === team._id &&
        challenge.status === "accepted"
    );
    console.log("Challenge:", challenge);
    return challenge;
  };

  return (
    <div className="bg-customDark2 hover:scale-105 transition-all duration-300 p-6 rounded-lg shadow-lg">
      <h4 className="sm:2xl text-4xl font-semibold mb-4">{team.teamName}</h4>
      <p className="text-sm mb-4">
       <strong className="-mb-4"> City: </strong><span>{team.city ? team.city : "Other"}</span> <br />
        <strong>Players:</strong>
        <ul className="list-disc list-inside">
          {team.players.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
      </p>
      
      {!checkIfChallenged() ? (
        <button
          onClick={() => onOpenChallenge(team)}
          className="flex items-center mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          <FaTrophy className="mr-2" />
          Challenge
        </button>
      ) : (
        <button className="flex items-center mt-4 px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed">
          <FaTrophy className="mr-2" />
          Already Challenged
        </button>
      )}
      {checkIfChallengeAccepted() && (
        <button className="flex items-center mt-4 px-4 py-2 bg-green-500 text-white rounded cursor-not-allowed">
          <FaTrophy className="mr-2" />
          Challenge Accepted
        </button>
      )}
    </div>
  );
};

export default CustomerTeamCard;