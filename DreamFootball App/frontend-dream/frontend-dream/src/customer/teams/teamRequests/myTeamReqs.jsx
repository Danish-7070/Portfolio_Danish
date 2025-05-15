import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyTeamRequestCard from './_components/myTeamRequestCard'
import { useTeam } from '../../../context/teamContext';

const URL = import.meta.env.VITE_BACKEND_URL;

const MyTeamReqs = () => {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currTeam } = useTeam();

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${URL}/team-requests/my-team-requests/${currTeam._id}`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            setMyRequests(response.data.myTeamRequests);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      console.log('hello')
        if (currTeam?._id) {
            fetchMyRequests();
        }
    }, [currTeam?._id]);

    if (!currTeam) {
        return (
            <div className="flex justify-center items-center h-96 bg-custom rounded-md shadow-md">
            {/* <div className="flex justify-center items-center h-96 bg-gray-800 rounded-md shadow-md"> */}
                <p className="text-primary">Please login to view your team's match requests!</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-200"></div>
                </div>
            ) : (
                <>
                    {error && (
                        <div
                            role="alert"
                            className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto mb-2"
                        >
                            <span>{error}</span>
                            <button 
                                className="btn btn-sm border-none" 
                                onClick={() => setError(null)}
                            >
                                x
                            </button>
                        </div>
                    )}
                    {myRequests.length > 0 ? (
                        myRequests.map((request) => (
                            <MyTeamRequestCard 
                                key={request._id} 
                                request={request} 
                                fetchMyRequests={fetchMyRequests}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-96">
                            <p className="text-gray-300">No team match requests found!</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyTeamReqs;