// ApprovedMatches.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApprovedMatchCard from './approvedMatchCard';
import { useUser } from '../../context/userContext';

const URL = import.meta.env.VITE_BACKEND_URL;

const ApprovedMatches = () => {
  const [approvedMatches, setApprovedMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { customer } = useUser();

  useEffect(() => {
    const fetchApprovedMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${URL}/customer/match-requests/approved/${customer._id}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setApprovedMatches(response.data.approvedRequests);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedMatches();
  }, [customer._id]);

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-primary text-lg font-medium">Please log in to view your approved matches.</p>
        {/* <p className="text-gray-800 text-lg font-medium">Please log in to view your approved matches.</p> */}
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-500"></div>
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
          {approvedMatches.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {approvedMatches.map((match) => (
                <ApprovedMatchCard key={match._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-800 text-lg font-medium">No approved matches found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprovedMatches;
