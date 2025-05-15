import React, { useEffect } from "react";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ImageIcon } from "lucide-react"; // Import icon for missing images

const LeagueCard = ({ league, onEdit, onDelete }) => {
  const handleEditClick = () => {
    onEdit(league);
  };

  const handleDeleteClick = () => {
    onDelete(league._id);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        {league.leagueName}{" "}
      </h2>
      <p>
        <span className="text-gray-400 text-sm">
          {new Date(league.startDate).toLocaleDateString()} -{" "}
          {new Date(league.endDate).toLocaleDateString()}
        </span>
      </p>

      {/* Display league image or default icon */}
      <div className="flex justify-center items-center mb-4">
        {(league.image && league.image.url) ? (
          <img
            src={league.image.url}
            alt={league.leagueName}
            className="w-40 h-40 rounded-full object-cover "
          />
        ) : (
          <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full">
            <ImageIcon size={32} className="text-gray-500" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-600">
        <div className="">
          <strong>Teams:</strong>
          <div className="flex flex-col">
            {league.teams.map((team, index) => (
              <span key={team._id}>
                <strong>{index + 1}.</strong> {team.teamName}
                {index < league.teams.length - 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="mt-4 bg-primary text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
          onClick={handleEditClick}
        >
          <AiFillEdit className="mr-2" />
          <p>Edit</p>
        </button>
        <button
          className="mt-4 bg-red-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
          onClick={handleDeleteClick}
        >
          <AiFillDelete className="mr-2" />
          <p>Delete</p>
        </button>
        <Link to={`/admin/dashboard/leagues/${league._id}`}>
          <button className="mt-4 bg-blue-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center">
            <AiFillEye className="mr-2" />
            <p>View Details</p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LeagueCard;
