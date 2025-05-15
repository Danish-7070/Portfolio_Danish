import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from './matchCard';
import { useUser } from '../../context/userContext';
import toast from 'react-hot-toast';

const URL = import.meta.env.VITE_BACKEND_URL;

const AvailableMatches = () => {
  const [availableMatches, setAvailableMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { customer } = useUser();

  const fetchAvailableMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/customer/match-requests/available-match-requests`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      console.log('matchRequests', response.data.matchRequests)
      setAvailableMatches(response.data.matchRequests);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableMatches();
  }, []);

  const handleInterest = async (matchId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(`${URL}/customer/match-requests/interested/${matchId}`, {
        playerId: customer._id,
        comments: comments
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = response.data;
      if (response.status > 400) {
        throw new Error(data.message);
      }
      await fetchAvailableMatches();
      toast.success('Interest sent successfully!');
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
            <div
              role="alert"
              className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto mb-2"
            >
              <span>{error}</span>
              <button className="btn btn-sm  border-none" onClick={() => setError(null)}>
                x
              </button>
            </div>
          )}
          {availableMatches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              loading={loading}
              isDialogOpen={isDialogOpen}
              comments={comments}
              setComments={setComments}
              setIsDialogOpen={setIsDialogOpen}
              onInterest={() => handleInterest(match._id)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default AvailableMatches;
