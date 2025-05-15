import React, { useEffect, useState } from "react";
import TeamCard from "../../components/teams/teamCard";
import { GiEmptyHourglass } from "react-icons/gi";
import EditTeamForm from "../../components/teams/editTeamForm";
import AdminSiderbar from "../../components/sidebar/sidebar";
import axios from "axios";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

const EditTeams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(error.response?.data?.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleEdit = (team) => {
    console.log("Editing team:", team);
    setSelectedTeam(team);
  };

  const handleSubmit = async (formData, teamId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare players data before sending
      const rawPlayersData = formData.get('players');
      let playersData = [];
      
      if (rawPlayersData) {
        // Parse the JSON string if it's a string
        if (typeof rawPlayersData === 'string') {
          try {
            playersData = JSON.parse(rawPlayersData);
          } catch (e) {
            console.error("Error parsing players data:", e);
            // If it's not valid JSON, assume it's already parsed
            playersData = rawPlayersData;
          }
        } else {
          playersData = rawPlayersData;
        }
        
        // Format player data properly for the updated model
        const formattedPlayers = playersData.map(player => {
          // If player is already in the right format with _id, keep it
          if (typeof player === 'object' && player._id) {
            return {
              _id: player._id,
              name: player.name,
              image: { url: null, filename: null }
            };
          } 
          // If player is a new addition (no _id) or just a string
          else {
            return {
              name: typeof player === 'string' ? player : player.name,
              image: { url: null, filename: null }
            };
          }
        });
        
        // Replace the players data in the formData
        formData.delete('players');
        formData.append('players', JSON.stringify(formattedPlayers));
      }
      
      const response = await axios.put(
        `${URL}/teams/${teamId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      
      setSelectedTeam(null);
      await fetchTeams();
      toast.success("Team updated successfully");
    } catch (error) {
      console.error("Error updating team:", error);
      setError(error?.response?.data?.message || "Failed to update team");
      toast.error(error?.response?.data?.message || "Failed to update team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col justify-start gap-4 pt-12 relative">
          {error && (
            <div
              role="alert"
              className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto"
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
          {selectedTeam && (
            <div
              className="absolute top-0 left-0 border-primary border-2 rounded-md p-1 text-center bg-primary text-white cursor-pointer"
              onClick={() => setSelectedTeam(null)}
            >
              {"Back"}
            </div>
          )}
          {selectedTeam ? (
            <EditTeamForm teamData={selectedTeam} onSubmit={handleSubmit} />
          ) : (
            <div className="flex flex-col gap-4">
              {teams?.length > 0 ? (
                teams.map((team) => (
                  <TeamCard
                    key={team._id}
                    type="edit"
                    team={team}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-xl shadow-md border border-black border-dashed">
                  <GiEmptyHourglass className="text-6xl text-gray-500" />
                  <p className="text-gray-500 text-2xl">No teams found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditTeams;