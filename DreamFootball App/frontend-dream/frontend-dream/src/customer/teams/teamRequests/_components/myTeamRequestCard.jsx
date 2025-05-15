import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTeam } from '../../../../context/teamContext';

const URL = import.meta.env.VITE_BACKEND_URL;

const MyTeamRequestCard = ({ request, fetchMyRequests }) => {
    const [interestedTeams, setInterestedTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currTeam } = useTeam();

    useEffect(() => {
        if (request) {
            const interestedTeamsList = request.interestedTeams;
            setInterestedTeams(interestedTeamsList);
        }
    }, [request]);

    const handleStatusChange = async (teamId, action) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.patch(
                `${URL}/team-requests//${request._id}/interested/${teamId}`,
                { action },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
            );
            
            if (response.status > 400) {
                throw new Error(response.data.message);
            }
            
            setInterestedTeams(prev =>
                prev.map(team =>
                    team.team._id === teamId ? { ...team, requestStatus: action } : team
                )
            );
            
            await fetchMyRequests();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-customDark2  rounded-lg p-6 mb-6 shadow-lg transition duration-300 hover:shadow-xl">
        {/* <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-lg transition duration-300 hover:shadow-xl"> */}
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{request.bookingId.ground.name}</h3>
            <p className="text-gray-400">Request Maker: <span className="text-gray-200">{request.matchMaker.name}</span></p>
            <p className="text-gray-400">Date: <span className="text-gray-200">{new Date(request.bookingId.bookingDate).toLocaleDateString()}</span></p>
            <p className="text-gray-400">Time: <span className="text-gray-200">{request.bookingId.bookingTime}</span></p>

            <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-200 mb-3">Interested Teams</h4>
                {interestedTeams.length > 0 ? (
                    interestedTeams.map(team => (
                        <div key={team.team._id} className="flex flex-col bg-gray-700 py-3 px-4 mb-2 rounded-lg shadow-inner">
                            <div className="flex justify-between items-center text-gray-200">
                                <div>
                                    <span className="font-medium">{team.team.name}</span>
                                    <span className="ml-2 text-sm px-2 py-1 rounded bg-gray-600">
                                        {team.requestStatus}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    {team.requestStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(team.team._id, 'approved')}
                                                disabled={loading}
                                                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded focus:outline-none transition duration-150"
                                            >
                                                Accept
                                            </button>
                                            {/* <button
                                                onClick={() => handleStatusChange(team.team._id, 'rejected')}
                                                disabled={loading}
                                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded focus:outline-none transition duration-150"
                                            >
                                                Reject
                                            </button> */}
                                        </>
                                    )}
                                </div>
                            </div>
                            {team.comments && (
                                <p className="mt-2 text-sm text-gray-300 italic">Comments: {team.comments}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-4">No teams have expressed interest yet.</p>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-500 text-white rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default MyTeamRequestCard;