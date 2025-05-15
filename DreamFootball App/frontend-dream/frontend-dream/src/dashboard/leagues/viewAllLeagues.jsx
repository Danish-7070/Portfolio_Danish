import React, { useEffect, useState } from "react";
import LeagueCard from "./leagueCard";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { BiFlag } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import EditLeagueForm from "./editLeagueForm";

const URL = import.meta.env.VITE_BACKEND_URL;

const ViewAllLeagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/leagues`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setLeagues(data.leagues);
      console.log('fetched leagues: ',data.leagues);
      await fetchTeams();
    } catch (error) {
      console.error("Error fetching leagues:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/teams`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setTeams(data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLeague = (league) => {
    setSelectedLeague(league);
  };

  const handleDeleteLeague = async (leagueId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete?`);
    if (confirmDelete) {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.delete(`${URL}/leagues/${leagueId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status >= 400) {
          throw new Error(response.data.message);
        }
        toast.success("League deleted successfully");
        await fetchLeagues();
      } catch (error) {
        console.error("Error deleting league:", error);
        setError(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to delete league");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitEditLeague = async (updatedLeague) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(
        `${URL}/leagues/${selectedLeague._id}`,
        updatedLeague,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status >= 400) {
        throw new Error(response.data.message);
      }
      await fetchLeagues();
      setSelectedLeague(null);
      toast.success("League updated successfully");
    } catch (error) {
      console.error("Error updating league:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to update league");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${dfawallpaper})`,
        backgroundSize: "cover",
      }}
      className="flex flex-col gap-4 min-h-screen pb-8"
    >
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="relative w-3/4 mx-auto pb-1">
            {selectedLeague && (
              <div
                className="absolute top-0 left-0 border-primary border-2 rounded-md p-1 text-center bg-primary text-white cursor-pointer"
                onClick={() => setSelectedLeague(null)}
              >
                {"Back"}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto mt-4"
              >
                <span>{error}</span>
                <div>
                  <button
                    className="btn btn-sm border-none"
                    onClick={() => setError(null)}
                  >
                    x
                  </button>
                </div>
              </div>
            )}
          </div>
          {selectedLeague ? (
            <EditLeagueForm
              teamsData={teams}
              leagueData={selectedLeague}
              onSubmit={handleSubmitEditLeague}
            />
          ) : (
            <>
              {leagues.length > 0 ? (
                leagues.map((league) => (
                  <LeagueCard
                    key={league._id}
                    league={league}
                    onEdit={handleEditLeague}
                    onDelete={handleDeleteLeague}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center h-96">
                  <BiFlag className="text-9xl text-gray-700" />
                  <div className="text-2xl text-gray-700">
                    No leagues available
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ViewAllLeagues;