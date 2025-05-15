import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeamRequestCard from './_components/teamRequestCard';
import toast from 'react-hot-toast';

import { useTeam } from '../../../context/teamContext';
const URL = import.meta.env.VITE_BACKEND_URL;

const AvailableTeamReqs = () => {
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { currTeam:team } = useTeam(); // Changed from customer to team

  const fetchAvailableRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/team-requests/available-team-requests/${team._id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      console.log('teamRequests', response.data.teamRequests);
      setAvailableRequests(response.data.teamRequests);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRequests();
  }, []);

  const handleInterest = async (requestId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(`${URL}/team-requests/interested/${requestId}`, {
        teamId: team._id,
        comments: comments
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      
      if (response.status > 400) {
        throw new Error(response.data.message);
      }
      
      await fetchAvailableRequests();
      toast.success('Team interest sent successfully!');
      setComments('');
      setIsDialogOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-200"></div>
        </div>
      ) : (
        <>
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto mb-2">
              <span>{error}</span>
              <button className="btn btn-sm border-none" onClick={() => setError(null)}>
                x
              </button>
            </div>
          )}
          {availableRequests.map((request) => (
            <TeamRequestCard
              key={request._id}
              request={request}
              loading={loading}
              isDialogOpen={isDialogOpen}
              comments={comments}
              setComments={setComments}
              setIsDialogOpen={setIsDialogOpen}
              onInterest={() => handleInterest(request._id)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default AvailableTeamReqs;