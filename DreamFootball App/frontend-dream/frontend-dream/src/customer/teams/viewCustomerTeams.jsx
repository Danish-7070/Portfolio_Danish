import React, { useEffect, useState } from "react";
import TeamServices from "../../services/TeamServices";
import CustomerTeamCard from "../../components/customerTeams/customerTeamCard";
import GeneralServices from "../../services/GeneralServices";
import { useTeam } from "../../context/teamContext";
import ChallengeServices from "../../services/ChallengeServices";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";

const URL = import.meta.env.VITE_BACKEND_URL;

const ViewCustomerTeams = () => {
  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState(null);

  const { currTeam } = useTeam();
  const [grounds, setGrounds] = useState([]);

  // New state to control how many teams and challenges are visible
  const [visibleTeamCount, setVisibleTeamCount] = useState(4);
  const [visibleChallengeCount, setVisibleChallengeCount] = useState(4);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamServices.fetchTeamsForCustomers();
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      console.log('currTeam:', currTeam);
      const filteredTeams = data.teams.filter((team) => team._id !== currTeam._id);
      console.log('fetched teams:', filteredTeams);
      setTeams(filteredTeams);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelfId(currTeam._id);
  }, [currTeam]);

  const fetchGrounds = async () => {
    try {
      const response = await GeneralServices.getGrounds();
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setGrounds(data.grounds);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChallengeServices.fetchChallenges();
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      console.log("challenges:", data.challenges)
      setChallenges(data.challenges);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChallengeServices.getChallengesForTeam();
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setActiveChallenges(data.challengesToGet);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchGrounds();
    fetchChallenges();
    fetchActiveChallenges();
  }, []);

  const handleShowMoreTeams = () => {
    if (visibleTeamCount === 4) {
      setVisibleTeamCount(teams.length); // Show all teams
    } else {
      setVisibleTeamCount(4); // Show only the first 4 teams
    }
  };

  const handleShowMoreChallenges = () => {
    if (visibleChallengeCount === 4) {
      setVisibleChallengeCount(activeChallenges.length); // Show all challenges
    } else {
      setVisibleChallengeCount(4); // Show only the first 4 challenges
    }
  };

  // Add these new state variables at the beginning of your ViewCustomerTeams component:
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGround, setSelectedGround] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  // Add this state at the beginning with other state variables
  const [selectedCity, setSelectedCity] = useState("All");

  // Add this function with other handler functions
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Add this to get filtered teams based on city selection
  const filteredTeams = selectedCity === "All"
    ? teams
    : teams.filter(team => team.city === selectedCity);

  // Add these new functions to your ViewCustomerTeams component:
  const handleOpenChallenge = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
    setSelectedGround("");
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSendChallenge = async () => {
    if (!selectedTeam || !selectedGround || !selectedDate || !selectedTime) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const groundId = grounds.find(
        (ground) => ground.name === selectedGround
      )._id;

      const response = await ChallengeServices.sendChallenge({
        challenged: selectedTeam._id,
        ground: groundId,
        date: selectedDate,
        time: selectedTime,
      });

      if (response.error) {
        setError("Error sending challenge: " + response.error);
        return;
      }

      // Refresh challenges list after sending a new challenge
      fetchChallenges();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleChallengeAccept = async (challengeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChallengeServices.changeChallengeStatus(challengeId, "accepted");

      if (response.error) {
        throw new Error(response.error);
      }

      // Show success message
      alert("Challenge accepted successfully!");

      // Refresh active challenges to update the UI
      fetchActiveChallenges();
    } catch (error) {
      setError(error.message || "Failed to accept challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeReject = async (challengeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChallengeServices.changeChallengeStatus(challengeId, "rejected");

      if (response.error) {
        throw new Error(response.error);
      }

      // Show success message
      alert("Challenge rejected successfully!");

      // Refresh active challenges to update the UI
      fetchActiveChallenges();
    } catch (error) {
      setError(error.message || "Failed to reject challenge");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-200"></div>
        </div>
      ) : (

        <>

          <>
            {error && (
              <div
                role="alert"
                className="alert alert-error leading-tight flex justify-between py-1 w-[84%] mx-auto mb-2"
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

            <div className="mb-6 w-full max-w-md mx-auto ">
              <label className="block text-sm font-medium mb-2 text-black">Filter by City:</label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full p-2 border rounded-md text-white bg-customDark2"
              >
                <option value="All">All Cities</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Quetta">Quetta</option>
                <option value="Kashmir">Kashmir</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Display teams */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.slice(0, visibleTeamCount) <= 0 ? (
                <p className="text-black">
                  No teams available
                </p>
              ) : (
                filteredTeams.slice(0, visibleTeamCount).map((team, index) => (
                  <CustomerTeamCard
                    key={index}
                    team={team}
                    grounds={grounds}
                    challenges={challenges}
                    selfId={selfId}
                    onOpenChallenge={handleOpenChallenge}
                  />

                ))
              )}
            </div>

            {filteredTeams.length > 4 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleShowMoreTeams}
                  className="text-red-500 font-semibold hover:bg-red-500 hover:text-white border-red-500 border-2 p-2 rounded-lg"
                >
                  {visibleTeamCount === 4 ? 'Show More' : 'Show Less'}
                </button>
              </div>
            )}

            <h2 className="text-3xl font-bold text-primary text-center mt-10 mb-6">
              Challenges request sent to you
            </h2>

            {/* Display challenges */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {
                activeChallenges?.slice(0, visibleChallengeCount).length === 0 ? (
                  <p className="text-black">
                    No challenges request sent to you
                  </p>
                )
                  :
                  (
                    activeChallenges?.slice(0, visibleChallengeCount).map((challenge, index) => (
                      <div
                        key={index}
                        className="bg-customDark2 hover:scale-105 transition-all duration-300 p-6 rounded-lg shadow-lg relative"
                      >
                        <div className="absolute top-1 right-2 p-1 rounded-full">
                          {challenge.status === "pending" && (
                            <span className="text-red-500">Pending</span>
                          )}
                          {challenge.status === "accepted" && (
                            <span className="text-green-500">Accepted</span>
                          )}
                          {challenge.status === "rejected" && (
                            <span className="text-gray-500">Rejected</span>
                          )}
                        </div>

                        <h2 className="text-2xl font-semibold mb-4">
                          {challenge.challengerTeam.teamName}
                        </h2>
                        <p className="text-sm mb-4">
                          <strong>Players:</strong>
                          <ul className="list-disc list-inside">
                            {challenge.challengerTeam.players.map((player, index) => (
                              <li key={index}>{player.name}</li>
                            ))}
                          </ul>
                        </p>
                        <p className="text-sm mb-4">
                          <strong>Ground:</strong> {challenge.ground.name}
                        </p>
                        <p className="text-sm mb-4">
                          <strong>Date:</strong> {formatDate(challenge.date)}
                        </p>
                        <p className="text-sm mb-4">
                          <strong>Time:</strong> {challenge.time}
                        </p>
                        <div className="flex items-center justify-center">
                          {challenge.status === 'pending' && (
                            <>
                              <button onClick={() => handleChallengeAccept(challenge._id)} className="flex items-center mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                Accept
                              </button>
                              <button onClick={() => handleChallengeReject(challenge._id)} className="flex items-center mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                                Reject
                              </button>
                            </>
                          )}
                          {challenge.status === 'accepted' && (
                            <button className="flex items-center mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                              Accepted
                            </button>
                          )}
                          {challenge.status === 'rejected' && (
                            <button className="flex items-center mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                              Rejected
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )
              }
            </div>

            {activeChallenges?.length > 4 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleShowMoreChallenges}
                  className="text-red-500 font-semibold hover:bg-red-500 hover:text-white border-red-500 border-2 p-2 rounded-lg"
                >
                  {visibleChallengeCount === 4 ? 'Show More' : 'Show Less'}
                </button>
              </div>
            )}
          </>

          {isModalOpen && selectedTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
                <h3 className="font-bold text-lg">Challenge {selectedTeam.teamName}</h3>
                <div className="py-4">
                  <label className="block mb-2">Select Ground:</label>
                  <select
                    value={selectedGround}
                    onChange={(e) => setSelectedGround(e.target.value)}
                    className="select select-bordered w-full mb-4"
                  >
                    <option value="">Select Ground</option>
                    {grounds.map((ground, index) => (
                      <option key={index} value={ground.name}>
                        {ground.name}
                      </option>
                    ))}
                  </select>
                  <label className="block mb-2">Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input input-bordered w-full mb-4"
                  />

                  <label className="block mb-2">Select Time:</label>
                  <input
                    type="time"
                    value={selectedTime || ""}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input input-bordered w-full mb-4"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSendChallenge}
                    className="btn btn-primary"
                  >
                    Send Challenge
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default ViewCustomerTeams;
