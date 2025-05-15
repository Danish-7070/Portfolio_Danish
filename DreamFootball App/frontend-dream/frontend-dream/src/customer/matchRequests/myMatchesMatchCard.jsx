import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';
import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

const MyMatchesMatchCard = ({ match, onInterest, fetchMyMatches }) => {
    const [alreadyInterested, setAlreadyInterested] = useState(false);
    const [interestedPlayers, setInterestedPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { customer } = useUser();

    useEffect(() => {
        if (match && customer) {
            const interestedPlayersList = match.interestedPlayers;
            setInterestedPlayers(interestedPlayersList);
            const isAlreadyInterested = interestedPlayersList.some(player => player.player.toString() === customer._id);
            setAlreadyInterested(isAlreadyInterested);
        }
    }, [match, customer]);

    const handleInterest = () => {
        if (onInterest) {
            onInterest(match);
        }
    };

    const handleStatusChange = async (playerId, action) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.patch(`${URL}/customer/match-requests/${match._id}/interested/${playerId}`, { action }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            const data = response.data;
            if (response.status > 400) {
                throw new Error(data.message);
            }
            setInterestedPlayers(prev =>
                prev.map(player =>
                    player.player.toString() === playerId ? { ...player, requestStatus: action } : player
                )
            );
            await fetchMyMatches();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-customDark2 border border-gray-700 rounded-lg p-6 mb-6 shadow-lg transition duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{match.bookingId.ground ? match.bookingId.ground.name : "Ground N/A"}</h3>
            <p className="text-gray-400">Request Maker: <span className="text-gray-200">{match.matchMaker.username}</span></p>
            <p className="text-gray-400">Date: <span className="text-gray-200">{new Date(match.bookingId.bookingDate).toLocaleDateString()}</span></p>
            <p className="text-gray-400">Time: <span className="text-gray-200">{match.bookingId.bookingTime}</span></p>
            <p className="text-gray-400">Players Needed: <span className="text-gray-200">{match.playersRequired}</span></p>

            <div className="mt-4">
                {interestedPlayers.map(player => (
                    <div key={player.player._id} className="flex flex-col bg-customDark  py-3 px-4 mb-2 rounded-lg shadow-inner">
                    {/* <div key={player.player._id} className="flex flex-col bg-gray-700 py-3 px-4 mb-2 rounded-lg shadow-inner"> */}
                        <div className="flex justify-between items-center text-gray-900">
                            <span>{player.player.username} - {player.requestStatus}</span>
                            <div className="flex space-x-2">
                                {player.requestStatus === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(player.player._id, 'approved')}
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded focus:outline-none transition duration-150"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(player.player._id, 'rejected')}
                                            disabled={loading}
                                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded focus:outline-none transition duration-150"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {player.comments && (
                            <p className="mt-2 text-sm text-gray-300 italic">Comments: {player.comments}</p>
                        )}
                    </div>
                ))}
            </div>

            {onInterest && (
                <button
                    onClick={handleInterest}
                    disabled={alreadyInterested}
                    className={`mt-4 w-full ${alreadyInterested ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-lg transition duration-200`}
                >
                    {alreadyInterested ? 'Interest Expressed' : 'Express Interest'}
                </button>
            )}
        </div>
    );
};

export default MyMatchesMatchCard;
