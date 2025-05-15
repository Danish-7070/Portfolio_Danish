import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/userContext';
import MyMatchesMatchCard from './myMatchesMatchCard';

const URL = import.meta.env.VITE_BACKEND_URL;

const MyMatches = ({ customerId }) => {
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { customer } = useUser();

  const fetchMyMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/customer/match-requests/my-matches/${customer._id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      console.log('response', response);
      setMyMatches(response.data.myMatches);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer) {
      fetchMyMatches();
    }
  }, [customerId]);

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-96 bg-custom rounded-md shadow-md">
        <p className="text-gray-300">Please login to view your matches!</p>
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
              <button className="btn btn-sm border-none" onClick={() => setError(null)}>
                x
              </button>
            </div>
          )}
          {myMatches.length > 0 ? (
            myMatches.map((match) => (
              <MyMatchesMatchCard fetchMyMatches={fetchMyMatches} key={match._id} match={match} />
            ))
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-300">No matches found!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyMatches;
