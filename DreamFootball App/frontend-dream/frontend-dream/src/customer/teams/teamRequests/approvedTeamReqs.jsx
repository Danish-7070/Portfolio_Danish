import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApprovedTeamRequestCard from './_components/approvedTeamRequestCard';
import { useTeam } from '../../../context/teamContext';

const URL = import.meta.env.VITE_BACKEND_URL;

const ApprovedTeamRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currTeam } = useTeam();

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${URL}/team-requests/approved/${currTeam._id}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setApprovedRequests(response.data.approvedRequests);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currTeam?._id) {
      fetchApprovedRequests();
    }
  }, [currTeam?._id]);

  if (!currTeam) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-800 text-lg font-medium">
          Please log in to view your team's approved matches.
        </p>
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
          {approvedRequests.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {approvedRequests.map((request) => (
                <ApprovedTeamRequestCard key={request._id} request={request} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-800 text-lg font-medium">
                No approved team matches found.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprovedTeamRequests;