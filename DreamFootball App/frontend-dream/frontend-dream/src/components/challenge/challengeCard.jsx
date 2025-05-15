import React from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const ChallengeCard = ({ challenge, onEdit, onCancel, onToggleStatus }) => {
    const handleEditClick = () => {
        onEdit(challenge);
    };

    const handleCancelClick = () => {
        onCancel(challenge);  
    };

    const handleToggleStatusClick = () => {
        onToggleStatus(challenge);
    };

    return (
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{challenge.title}</h3>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <p className="text-gray-600 mb-4">Points: {challenge.points}</p>
            <p className="text-gray-600 mb-4">Created At: {new Date(challenge.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-4">Status: {challenge.status}</p>
            <div className="flex gap-2">
                <button
                    className="mt-4 bg-primary text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
                    onClick={handleEditClick}
                >
                    <AiFillEdit className="mr-2" />
                    <p>Edit</p>
                </button>
                <button
                    className="mt-4 bg-red-500 text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center"
                    onClick={handleCancelClick}
                >
                    <AiFillDelete className="mr-2" />
                    <p>Cancel</p>
                </button>
                <button
                    className={`mt-4 ${challenge.status === "active" ? "bg-red-500" : "bg-primary"} text-white rounded-md py-2 px-5 focus:outline-none focus:ring-2 transition duration-200 flex items-center justify-center`}
                    onClick={handleToggleStatusClick}
                >
                    <p>{challenge.status === "active" ? "Make Inactive" : "Make Active"}</p>
                </button>
            </div>
        </div>
    );
};

export default ChallengeCard;
