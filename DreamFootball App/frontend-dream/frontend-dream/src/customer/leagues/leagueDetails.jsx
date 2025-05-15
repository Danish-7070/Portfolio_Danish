import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import { BiFootball } from "react-icons/bi";
import Navbar from "../../components/navbar/navbar";
import { useTeam } from "../../context/teamContext";
import { IoFootballSharp } from "react-icons/io5";
import backGroundLogo from "../../assets/logoWhite.png"
import TeamDetailsModal2 from './TeamDetailsModal2'; // Adjust path as needed
import TeamServices from "../../services/TeamServices";

const URL = import.meta.env.VITE_BACKEND_URL;

const LeagueDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [league, setLeague] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const [acitveTableTab, setActiveTableTab] = useState('topScorers');
  const { currTeam } = useTeam();

  const [teamStats, setTeamStats] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [topCleanSheets, setTopCleanSheets] = useState([]);
  const [totalGoals, setTotalGoals] = useState(0);
  const [pointsTable, setPointsTable] = useState([]);


  // Add this function to fetch team statistics
  const fetchTeamStats = async () => {
    try {
      const response = await TeamServices.fetchTeamStatistics();
      console.log('response: ',response)
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch team statistics');
      }
      setTeamStats(response.data.data.teams);
    } catch (err) {
      console.error('Error fetching team statistics:', err);
    }
  };

  // Modify the useEffect that already fetchs league data to also fetch team stats
  useEffect(() => {
    fetchLeague();
    fetchTeamStats();
  }, []);


  const fetchLeague = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/teams/leagues/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setLeague(data.league);
    } catch (error) {
      setError(error.response?.data?.message || "Some Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeague();
  }, []);

  const calculatePointsTable = () => {
    if (!league) return;

    const pointsTable = {};

    // Initialize stats for each team
    league.teams.forEach((team) => {
      pointsTable[team._id] = {
        points: 0,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0
      };
    });

    // Iterate over matches and calculate stats
    league.matches.forEach((match) => {
      const { teamA, teamB, winner, score } = match;

      if (teamA && teamB && score) {
        pointsTable[teamA._id].matchesPlayed++;
        pointsTable[teamB._id].matchesPlayed++;

        // Update goals for and against
        pointsTable[teamA._id].goalsFor += score.teamA;
        pointsTable[teamA._id].goalsAgainst += score.teamB;
        pointsTable[teamB._id].goalsFor += score.teamB;
        pointsTable[teamB._id].goalsAgainst += score.teamA;

        if (winner) {
          pointsTable[winner._id].wins++;
          pointsTable[winner._id].points += 3;
          // Update losses based on the winner
          if (winner._id === teamA._id) {
            pointsTable[teamB._id].losses++; // teamB loses
          } else {
            pointsTable[teamA._id].losses++; // teamA loses
          }
        } else {
          // Match is a draw
          pointsTable[teamA._id].draws++;
          pointsTable[teamB._id].draws++;
          pointsTable[teamA._id].points += 1;
          pointsTable[teamB._id].points += 1;
        }
      }
    });

    // Calculate goal difference
    Object.keys(pointsTable).forEach((teamId) => {
      const team = pointsTable[teamId];
      team.goalDiff = team.goalsFor - team.goalsAgainst;
    });

    // Convert to array and sort
    const sortedPointsTable = Object.entries(pointsTable)
      .map(([teamId, stats]) => ({
        team: league.teams.find((t) => t._id === teamId),
        ...stats,
      }))
      .sort((a, b) =>
        b.points - a.points || // First sort by points
        b.goalDiff - a.goalDiff || // Then by goal difference
        b.goalsFor - a.goalsFor // Then by goals scored
      );

    setPointsTable(sortedPointsTable);
  };

  const getTopScorerAndTotalGoals = () => {
    if (!league) return;

    const scorers = {};
    let totalGoals = 0;

    league.matches.forEach((match) => {
      match.scorers.forEach((scorer) => {
        // Get player info - handle both populated and unpopulated references
        const playerId = typeof scorer.player === 'object' ? scorer.player._id : scorer.player;
        const playerName = typeof scorer.player === 'object' ? scorer.player.name : "Unknown Player";
        const teamName = typeof scorer.team === 'object' ? scorer.team.teamName : "Unknown Team";

        if (!scorers[playerId]) {
          scorers[playerId] = {
            player: playerName,
            score: 0,
            team: teamName,
            teamLogo: typeof scorer.team === 'object' ? (scorer?.team?.image?.url ? scorer.team.image.url : null) : null
          };
        }

        scorers[playerId].score += scorer.score;
        totalGoals += scorer.score;
      });
    });

    // Convert to array and sort
    const scorersList = Object.values(scorers).sort((a, b) => b.score - a.score);
    setTopScorers(scorersList);
    setTotalGoals(totalGoals);
  };

  const getTopAssists = () => {
    if (!league) return;

    const assisters = {};

    league.matches.forEach((match) => {
      match.assists && match.assists.forEach((assist) => {
        // Get player info - handle both populated and unpopulated references
        const playerId = typeof assist.player === 'object' ? assist.player._id : assist.player;
        const playerName = typeof assist.player === 'object' ? assist.player.name : "Unknown Player";
        const teamName = typeof assist.team === 'object' ? assist.team.teamName : "Unknown Team";

        if (!assisters[playerId]) {
          assisters[playerId] = {
            player: playerName,
            score: 0,
            team: teamName,
            teamLogo: typeof assist.team === 'object' ? (assist?.team?.image?.url ? assist.team.image.url : null) : null
          };
        }

        assisters[playerId].score += assist.score;
      });
    });

    // Convert to array and sort
    const assistersList = Object.values(assisters).sort((a, b) => b.score - a.score);
    setTopAssists(assistersList);
  };

  const getTopCleanSheets = () => {
    if (!league) return;

    const cleanSheetStats = {};

    league.matches.forEach((match) => {
      if (match.cleanSheets) {
        // Process Team A clean sheet
        if (match.cleanSheets.teamA && match.cleanSheets.goalKeeperA) {
          const teamId = match.teamA._id;
          const teamName = match.teamA.teamName;

          // Get goalkeeper info
          const keeperId = typeof match.cleanSheets.goalKeeperA === 'object'
            ? match.cleanSheets.goalKeeperA._id
            : match.cleanSheets.goalKeeperA;

          const keeperName = typeof match.cleanSheets.goalKeeperA === 'object'
            ? match.cleanSheets.goalKeeperA.name
            : "Unknown Goalkeeper";

          if (!cleanSheetStats[teamId]) {
            cleanSheetStats[teamId] = {
              teamName,
              goalkeepers: {},
              totalCleanSheets: 0,
              teamLogo: match?.teamA?.image?.url ? match.teamA.image.url : null
            };
          }

          if (!cleanSheetStats[teamId].goalkeepers[keeperId]) {
            cleanSheetStats[teamId].goalkeepers[keeperId] = {
              name: keeperName,
              count: 0
            };
          }

          cleanSheetStats[teamId].goalkeepers[keeperId].count++;
          cleanSheetStats[teamId].totalCleanSheets++;
        }

        // Process Team B clean sheet
        if (match.cleanSheets.teamB && match.cleanSheets.goalKeeperB) {
          const teamId = match.teamB._id;
          const teamName = match.teamB.teamName;

          // Get goalkeeper info
          const keeperId = typeof match.cleanSheets.goalKeeperB === 'object'
            ? match.cleanSheets.goalKeeperB._id
            : match.cleanSheets.goalKeeperB;

          const keeperName = typeof match.cleanSheets.goalKeeperB === 'object'
            ? match.cleanSheets.goalKeeperB.name
            : "Unknown Goalkeeper";

          if (!cleanSheetStats[teamId]) {
            cleanSheetStats[teamId] = {
              teamName,
              goalkeepers: {},
              totalCleanSheets: 0,
              teamLogo: match?.teamB?.image?.url ? match.teamB.image.url : null
            };
          }

          if (!cleanSheetStats[teamId].goalkeepers[keeperId]) {
            cleanSheetStats[teamId].goalkeepers[keeperId] = {
              name: keeperName,
              count: 0
            };
          }

          cleanSheetStats[teamId].goalkeepers[keeperId].count++;
          cleanSheetStats[teamId].totalCleanSheets++;
        }
      }
    });

    // Format for display
    const sortedStats = Object.values(cleanSheetStats)
      .map(team => {
        // Convert goalkeeper object to formatted string for display
        const formattedGoalkeepers = {};
        Object.entries(team.goalkeepers).forEach(([id, keeper]) => {
          formattedGoalkeepers[keeper.name] = keeper.count;
        });

        return {
          ...team,
          goalkeepers: formattedGoalkeepers,
        };
      })
      .sort((a, b) => b.totalCleanSheets - a.totalCleanSheets);

    setTopCleanSheets(sortedStats);
  };

  useEffect(() => {
    if (league) {
      calculatePointsTable();
      getTopScorerAndTotalGoals();
      getTopAssists();
      getTopCleanSheets();
    }
  }, [league]);

  const tableTabs = [
    { id: 'topScorers', label: 'Top Scorers' },
    { id: 'topAssists', label: 'Top Assists' },
    { id: 'cleanSheets', label: 'Clean Sheets' },
  ];

  // Add this function to handle team selection
  const handleTeamSelect = (teamId) => {
    const team = teamStats.find(t => t.team._id === teamId);
    if (team) {
      setSelectedTeam(team);
      setShowTeamModal(true);
    }
  };

  // Add this function to close the team modal
  const closeTeamModal = () => {
    setShowTeamModal(false);
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-custom text-white p-20 pt-5 max-sm:p-2">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div
            className="mx-auto mt-20 p-10 max-sm:p-2 border-primary border-2"
            style={{
              backgroundImage: `url(${backGroundLogo})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center 350px',
              backgroundSize: '50%',
              backgroundBlendMode: 'overlay',
              backgroundOpacity: '0.1',
              position: 'relative'
            }}
          >
            {/* Add this div to create an overlay that makes the background more subtle */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                zIndex: -1
              }}
            />
            {error && (
              <div
                role="alert"
                className="alert alert-error flex justify-between items-center py-2 mb-4 bg-red-400 border border-red-500 rounded-md"
              >
                <span className="text-black">{error}</span>
                <button
                  className="text-red-600 font-bold"
                  onClick={() => setError(null)}
                >
                  x
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mb-8 max-sm:flex-col gap-6">
              <h1 className="text-5xl font-bold mb-6 text-center w-1/2 items-center flex-col flex max-sm:w-full max-sm:text-xl text-primary">
                <div className="w-20 h-20 rounded-full bg-gray-800 bg-opacity-50 p-2 mb-4 flex items-center justify-center shadow-lg border-2 border-primary">
                  {league?.image?.url ? (
                    <img src={league.image.url} alt={league.leagueName} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <BiFootball className="text-5xl text-custom" />
                  )}
                </div>
                <p className="max-sm:mb-4 text-primary">{league?.leagueName}</p>
                <p className="text-primary">Details</p>
                <div className="inline-flex items-center justify-center px-4 py-1 mt-2 bg-gray-700 bg-opacity-50 rounded-full shadow-md">
                  <span className="text-sm font-bold text-gray-200">
                    {new Date(league?.startDate).toLocaleDateString()} — {new Date(league?.endDate).toLocaleDateString()}
                  </span>
                </div>
              </h1>

              <div className="w-1/2 max-sm:w-full p-6 rounded-lg text-xl border-2 border-primary border-dashed text-primary shadow-lg font-semibold bg-gray-800 bg-opacity-20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-primary border-opacity-30">
                  <div className="flex items-center gap-2">
                    <BiFootball className="text-2xl text-white" />
                    <p className="text-white">League Information</p>
                  </div>
                  <div className="bg-customDark bg-opacity-50 px-3 py-1 rounded-lg shadow-inner">
                    <p className="text-white">
                      <strong>Total Teams:</strong> <span className="text-custom font-bold">{league?.teams?.length}</span>
                    </p>
                  </div>
                </div>

                <p className="text-white mb-2 flex items-center gap-2 text-lg">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <strong>Teams:</strong>
                </p>
                <div className="pl-4 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-700 text-sm">
                  <ol className="list-decimal ml-5 font-bold space-y-1">
                    {league?.teams?.map((team, idx) => (
                      <li key={idx} className="text-white hover:text-white transition-colors duration-200">
                        {team.teamName}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Points Table Section Start */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-4 text-primary max-sm:text-xl">
                Points Table
              </h2>
              <div className="overflow-x-auto bg-gray-900 bg-opacity-80 rounded-lg shadow-xl border border-gray-500">
                <table className="w-full">
                  <thead>
                    {/* <tr className="bg-[#c9bd35] text-white border-b border-gray-500"> */}
                    <tr className="bg-green-700 text-white border-b border-gray-500">
                      <th className="py-3 px-4 text-left font-bold">Rank</th>
                      <th className="py-3 px-4 text-left font-bold">Team</th>
                      <th className="py-3 px-4 text-center font-bold">GP</th>
                      <th className="py-3 px-4 text-center font-bold">W</th>
                      <th className="py-3 px-4 text-center font-bold">D</th>
                      <th className="py-3 px-4 text-center font-bold">L</th>
                      <th className="py-3 px-4 text-center font-bold">GF</th>
                      <th className="py-3 px-4 text-center font-bold">GA</th>
                      <th className="py-3 px-4 text-center font-bold">GD</th>
                      <th className="py-3 px-4 text-center font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTable.map((team, idx) => {
                      // Determine row color based on position
                      let rowColorClass = "";
                      if (pointsTable.length >= 6) {
                        if (idx < 4) {
                          rowColorClass = "bg-customDark2 bg-opacity-50"; // Promotion zone
                        } else if (idx >= pointsTable.length - 2) {
                          rowColorClass = "bg-primary bg-opacity-30"; // Relegation zone
                        } else {
                          rowColorClass = idx % 2 === 0 ? "bg-gray-600 bg-opacity-50" : "bg-gray-900 bg-opacity-70"; // Alternating rows
                        }
                      } else {
                        rowColorClass = idx % 2 === 0 ? "bg-gray-600 bg-opacity-50" : "bg-gray-900 bg-opacity-70"; // Alternating rows
                      }

                      return (
                        <tr
                          key={idx}
                          className={`${rowColorClass} hover:bg-gray-500 transition-colors duration-150 text-gray-200`}
                        >
                          <td className="py-3 px-4 border-b border-gray-600">
                            <div className="flex items-center">
                              <span className="font-bold w-6 text-center">{idx + 1}</span>
                              {idx < 4 && pointsTable.length >= 6 && (
                                <span className="ml-1 w-2 h-2 rounded-full bg-custom"></span>
                              )}
                              {idx >= pointsTable.length - 2 && pointsTable.length >= 6 && (
                                <span className="ml-1 w-2 h-2 rounded-full bg-primary"></span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-b border-gray-600">
                            <div className="flex items-center">
                              {team.team.image?.url ? (
                                <img
                                  src={team.team.image.url}
                                  alt={team.team.teamName}
                                  className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-primary shadow-md"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-2 border-2 border-primary">
                                  <BiFootball className="text-gray-300" />
                                </div>
                              )}
                              <span
                                className="font-medium cursor-pointer hover:text-custom hover:underline transition-colors"
                                onClick={() => handleTeamSelect(team.team._id)}
                              >
                                {team.team.teamName}
                              </span>
                            </div>
                          </td>

                          {showTeamModal && selectedTeam && (
                            <TeamDetailsModal2
                              team={selectedTeam}
                              onClose={closeTeamModal}
                            />
                          )}
                          <td className="py-3 px-4 text-center border-b border-gray-600">{team.matchesPlayed}</td>
                          <td className="py-3 px-4 text-center border-b border-gray-600 text-custom font-medium">{team.wins}</td>
                          <td className="py-3 px-4 text-center border-b border-gray-600 text-yellow-400 font-medium">{team.draws}</td>
                          <td className="py-3 px-4 text-center border-b border-gray-600 text-primary font-medium">{team.losses}</td>
                          <td className="py-3 px-4 text-center border-b border-gray-600">{team.goalsFor}</td>
                          <td className="py-3 px-4 text-center border-b border-gray-600">{team.goalsAgainst}</td>
                          <td className="py-3 px-4 text-center border-b border-gray-600">
                            {team.goalDiff > 0 ? (
                              <span className="text-custom">+{team.goalDiff}</span>
                            ) : team.goalDiff < 0 ? (
                              <span className="text-primary">{team.goalDiff}</span>
                            ) : (
                              team.goalDiff
                            )}
                          </td>
                          <td className="py-3 px-4 text-center border-b border-gray-600 font-bold bg-custom bg-opacity-20">{team.points || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-white bg-gray-600 bg-opacity-50 p-3 rounded-lg">
                {pointsTable.length >= 6 && (
                  <>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-custom mr-2"></span>
                      <span>Promotion Zone</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                      <span>Relegation Zone</span>
                    </div>
                  </>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">GP: Games Played</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">W: Wins</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">D: Draws</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">L: Losses</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">GF: Goals For</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">GA: Goals Against</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">GD: Goal Difference</span>
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-70 rounded-md shadow-sm">PTS: Points</span>
                </div>
              </div>
            </div>
            {/* Points Table Section End */}

            {/* Enhanced Statistics Tabs */}
            <h2 className="text-3xl font-bold mb-4 text-primary max-sm:text-xl">
              Statistics
            </h2>
            <div className="bg-gray-900 bg-opacity-60 rounded-lg shadow-lg mb-10 overflow-hidden border border-gray-500">
              <div className="p-5 rounded-lg max-sm:text-sm">
                <div className="flex justify-between items-center mb-6 max-sm:flex-col">
                  <p className="font-semibold text-lg text-custom">
                    <strong>Total Goals:</strong> {totalGoals}
                  </p>
                </div>

                <div >
                  {/* Enhanced Tabs */}
                  <div className="flex justify-center space-x-4 mb-6 border-b border-gray-500 pb-2">
                    {tableTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTableTab(tab.id)}
                        className={`px-6 py-3 rounded-t-lg transition-colors duration-300 font-medium
                  ${acitveTableTab === tab.id
                            ? tab.id === 'topScorers' ? 'bg-green-700 text-white shadow-md' :
                              tab.id === 'topAssists' ? 'bg-green-700 text-white shadow-md' :
                                'bg-green-700 text-white shadow-md'
                            : 'bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-white'} 
                  focus:outline-none`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Top Scorers Table */}
                  {acitveTableTab === 'topScorers' && (
                    <>
                      <div className="pt-4">
                        <h2 className="text-2xl font-semibold mb-4 text-custom max-sm:text-xl">
                          Top Scorers
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-green-700 text-white border-b border-gray-500">
                                <th className="py-3 px-4 text-left font-bold">Rank</th>
                                <th className="py-3 px-4 text-left font-bold">Player</th>
                                <th className="py-3 px-4 text-left font-bold">Team</th>
                                <th className="py-3 px-4 text-center font-bold">Goals</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topScorers.map((scorer, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-gray-600 bg-opacity-50" : "bg-gray-900 bg-opacity-70"}>
                                  <td className="py-3 px-4 border-b border-gray-600">{i + 1}</td>
                                  <td className="py-3 px-4 border-b border-gray-600">
                                    <div className="flex items-center">
                                      {scorer?.teamLogo ? (
                                        <img src={scorer.teamLogo} alt={scorer.team} className="w-8 h-8 rounded-full mr-3 border-2 border-primary shadow-md" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-3 border-2 border-primary">
                                          <BiFootball className="text-gray-300" />
                                        </div>
                                      )}
                                      <span className="font-medium">
                                        <Link to="/player-profiles" target="_blank" className="text-white hover:text-custom">
                                          {scorer.player}
                                        </Link>
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 border-b border-gray-600">{scorer.team}</td>
                                  <td className="py-3 px-4 border-b border-gray-600 text-center font-bold bg-opacity-20">{scorer.score}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Top Assists Table */}
                  {acitveTableTab === 'topAssists' && (
                    <>
                      <div className="pt-4">
                        <h2 className="text-2xl font-semibold mb-4 text-custom max-sm:text-xl">
                          Top Assists
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-green-700 text-white border-b border-gray-500">
                                <th className="py-3 px-4 text-left font-bold">Rank</th>
                                <th className="py-3 px-4 text-left font-bold">Player</th>
                                <th className="py-3 px-4 text-left font-bold">Team</th>
                                <th className="py-3 px-4 text-center font-bold">Assists</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topAssists.map((assister, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-gray-600 bg-opacity-50" : "bg-gray-900 bg-opacity-70"}>
                                  <td className="py-3 px-4 border-b border-gray-600">{i + 1}</td>
                                  <td className="py-3 px-4 border-b border-gray-600">
                                    <div className="flex items-center">
                                      {assister?.teamLogo ? (
                                        <img src={assister.teamLogo} alt={assister.team} className="w-8 h-8 rounded-full mr-3 border-2 border-primary shadow-md" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-3 border-2 border-primary">
                                          <BiFootball className="text-gray-300" />
                                        </div>
                                      )}
                                      <span className="font-medium">
                                        <Link to="/player-profiles" target="_blank" className="text-white hover:text-custom">
                                          {assister.player}
                                        </Link>
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 border-b border-gray-600">{assister.team}</td>
                                  <td className="py-3 px-4 border-b border-gray-600 text-center font-bold bg-opacity-20">{assister.score}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Clean Sheets Table */}
                  {acitveTableTab === 'cleanSheets' && (
                    <div className="pt-4">
                      <h2 className="text-2xl font-semibold mb-4 text-custom max-sm:text-xl">
                        Clean Sheets
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-green-700 text-white border-b border-gray-500">
                              <th className="py-3 px-4 text-left font-bold">Rank</th>
                              <th className="py-3 px-4 text-left font-bold">Goal Keeper(s)</th>
                              <th className="py-3 px-4 text-left font-bold">Team</th>
                              <th className="py-3 px-4 text-center font-bold">Clean Sheets</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topCleanSheets.map((stat, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-gray-600 bg-opacity-50" : "bg-gray-900 bg-opacity-70"}>
                                <td className="py-3 px-4 border-b border-gray-600">{i + 1}</td>
                                <td className="py-3 px-4 border-b border-gray-600">
                                  {Object.entries(stat.goalkeepers)
                                    .map(([name, count]) => (
                                      <span key={name} className="inline-block bg-gray-500 px-2 py-1 rounded mr-2 mb-1 text-sm">
                                        {name} <span className="font-semibold">({count})</span>
                                      </span>
                                    ))}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-600">
                                  <div className="flex items-center">
                                    {stat?.teamLogo ? (
                                      <img src={stat.teamLogo} alt={stat.teamName} className="w-8 h-8 rounded-full mr-3 border-2 border-primary shadow-md" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-3 border-2 border-primary">
                                        <BiFootball className="text-gray-300" />
                                      </div>
                                    )}
                                    <span className="font-medium">{stat.teamName}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-600 text-center font-bold bg-opacity-20">{stat.totalCleanSheets}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center mb-8">
              <button
                onClick={() => setShowMatches(!showMatches)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 
            ${showMatches ? 'bg-primary text-white hover:bg-red-600' : 'bg-green-700 text-white hover:bg-customDark'} 
            shadow-md focus:outline-none`}
              >
                {showMatches ? "Hide Matches" : "Show Matches"}
              </button>
            </div>
            {showMatches && (
              <h2 className="text-3xl font-bold mb-4 text-primary max-sm:text-xl mt-10">
                Matches
              </h2>
            )}
            <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
              {showMatches && (
                <>
                  {league?.matches?.map((match, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-900 bg-opacity-85 p-5 rounded-lg shadow-lg max-sm:text-sm border-l-4 border-l-custom hover:border-l-primary transition-all duration-300 relative overflow-hidden text-gray-200"
                    >
                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary bg-opacity-20 transform rotate-45 translate-x-8 -translate-y-8"></div>

                      <div className="flex justify-between mb-6 max-sm:flex-col border-b border-gray-500 pb-3">
                        <div className="flex items-center space-x-2">
                          <BiFootball className="text-xl text-custom" />
                          <p className="font-medium text-white">
                            <strong>Match {idx + 1}:</strong>
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-400">
                            <strong>Date:</strong>{" "}
                            {new Date(match.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            <strong>Time:</strong>{" "}
                            {match.time || "Not Available"}
                          </p>
                        </div>
                      </div>

                      {/* Teams section with improved visuals */}
                      <div className="flex justify-between items-center mb-6 p-3 bg-gray-600 bg-opacity-70 rounded-lg">
                        <div className="flex flex-col items-center w-2/5">
                          <div className="w-10 h-10 rounded-full bg-customDark bg-opacity-30 flex items-center justify-center shadow-md mb-2">
                            {match.teamA?.image?.url ? (
                              <img src={match.teamA.image.url} alt={match.teamA?.teamName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <BiFootball className="text-custom" />
                            )}
                          </div>
                          <span className="text-center font-medium text-sm">{match.teamA?.teamName}</span>
                        </div>

                        <div className="flex flex-col items-center w-1/5">
                          <div className="text-xl font-bold bg-gray-500 rounded-lg py-1 px-4 shadow-md text-white">
                            {match.score?.teamA} - {match.score?.teamB}
                          </div>
                          <span className="mt-2 text-xs px-2 py-1 rounded-full bg-gray-500">VS</span>
                        </div>

                        <div className="flex flex-col items-center w-2/5">
                          <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center shadow-md mb-2">
                            {match.teamB?.image?.url ? (
                              <img src={match.teamB.image.url} alt={match.teamB?.teamName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <BiFootball className="text-primary" />
                            )}
                          </div>
                          <span className="text-center font-medium text-sm">{match.teamB?.teamName}</span>
                        </div>
                      </div>

                      {/* Winner badge */}
                      <div className="flex justify-center items-center mb-5">
                        {match.winner ? (
                          <div className="flex items-center space-x-2 bg-custom bg-opacity-20 px-4 py-2 rounded-full">
                            <span className="text-sm font-semibold text-gray-300">Winner:</span>
                            <span className="font-medium text-white">{match.winner?.teamName}</span>
                          </div>
                        ) : (
                          <div className="bg-gray-500 px-4 py-2 rounded-full">
                            <span className="text-sm font-medium text-gray-300">Match Drawn</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-customDark bg-opacity-20 p-3 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="w-2 h-2 rounded-full bg-custom mr-2"></span>
                            <strong className="text-custom">Scorers:</strong>
                          </div>
                          {match.scorers.length > 0 ? (
                            <ul className="ml-4 list-disc space-y-1">
                              {match.scorers.map((scorer, i) => (
                                <li key={i} className="text-sm">
                                  <span className="font-medium">
                                    {typeof scorer.player === 'object'
                                      ? scorer.player.name
                                      : "Unknown Player"}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    ({typeof scorer.team === 'object'
                                      ? scorer.team.teamName
                                      : "Unknown Team"})
                                  </span>
                                  <span className="ml-1 bg-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {scorer?.score}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm italic ml-4 text-gray-400">No Scorers</p>
                          )}
                        </div>

                        <div className="bg-primary bg-opacity-20 p-3 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                            <strong className="text-primary">Assists:</strong>
                          </div>
                          {match.assists && match.assists.length > 0 ? (
                            <ul className="ml-4 list-disc space-y-1">
                              {match.assists.map((assist, i) => (
                                <li key={i} className="text-sm">
                                  <span className="font-medium">
                                    {typeof assist.player === 'object'
                                      ? assist.player.name
                                      : "Unknown Player"}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    ({typeof assist.team === 'object'
                                      ? assist.team.teamName
                                      : "Unknown Team"})
                                  </span>
                                  <span className="ml-1 bg-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {assist?.score}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm italic ml-4 text-gray-400">No Assists</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeagueDetails; 