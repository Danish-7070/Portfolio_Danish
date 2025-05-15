import React from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Users } from "lucide-react";

const TeamCard = ({ team, onEdit, onRemove, type = "edit" }) => {
  return (
    <div className="p-4 border border-gray-300 shadow-lg bg-white flex justify-between items-center rounded-lg transition-transform duration-200 hover:shadow-lg w-full">
      <div className="flex gap-4 flex-grow">
        <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          {team.image && team.image.url ? (
            <img 
              src={team.image.url} 
              alt={`${team.teamName} logo`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Users size={48} className="text-gray-400" />
          )}
        </div>
        <div className="flex-grow">
          <h2 className="font-bold text-lg text-gray-800">{team.teamName}</h2>
          <p className="text-gray-800">{team.email}</p>
          <p className="text-gray-800">City: {team.city ? team.city : "Other"}</p>
          <div className="mt-2 border-2 p-5 mr-2 rounded-xl border-dashed">
            <p className="text-gray-800">Player Sheet</p>
            <ul className="list-disc list-inside text-gray-600 pb-3">
              {(team.players && team.players.length > 0) && team.players.map((player, index) => (
                <li key={index}>{player.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        onClick={() => (type === "remove" ? onRemove(team._id) : onEdit(team))}
        className={`btn text-white flex items-center ${
          type === "remove"
            ? "bg-red-500 hover:bg-red-700"
            : "bg-primary hover:bg-secondary"
        }`}
      >
        {type === "remove" ? (
          <>
            <AiFillDelete className="mr-2" /> Remove
          </>
        ) : (
          <>
            <AiFillEdit className="mr-2" /> Edit
          </>
        )}
      </button>
    </div>
  );
};

export default TeamCard;