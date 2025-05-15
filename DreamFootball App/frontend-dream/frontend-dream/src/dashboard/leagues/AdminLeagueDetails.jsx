import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSiderbar from "../../components/sidebar/sidebar";
import axios from "axios";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import { BiFootball } from "react-icons/bi";
import backGroundLogo from "../../assets/logo.png"
import TeamServices from "../../services/TeamServices"; // Adjust path as needed
import TeamDetailsModal2 from "../../customer/leagues/TeamDetailsModal2";

const URL = import.meta.env.VITE_BACKEND_URL;

const AdminLeagueDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [league, setLeague] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const [acitveTableTab, setActiveTableTab] = useState('topScorers');

  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [topCleanSheets, setTopCleanSheets] = useState([]);
  const [totalGoals, setTotalGoals] = useState(0);

  // Add these state variables inside the LeagueDetails component
  const [teamStats, setTeamStats] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Add this function to fetch team statistics
  const fetchTeamStats = async () => {
    try {
      const response = await TeamServices.fetchTeamStatistics();
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch team statistics');
      }
      setTeamStats(response.data.data.teams);
    } catch (err) {
      console.error('Error fetching team statistics:', err);
    }
  };

  useEffect(() => {
    fetchLeague();
    fetchTeamStats();
  }, []);


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


  const fetchLeague = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/leagues/${id}`, {
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
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeague();
  }, []);

  const [pointsTable, setPointsTable] = useState([]);

  const calculatePointsTable = () => {
    const pointsTable = [];

    // Initialize stats for each team
    league?.teams.forEach((team) => {
      pointsTable[team._id] = {
        points: 0,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,      // GF
        goalsAgainst: 0,  // GA
        goalDiff: 0       // GD
      };
    });

    // Iterate over matches and calculate stats
    league?.matches.forEach((match) => {
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

    // Calculate goal difference and create sorted table
    Object.keys(pointsTable).forEach((teamId) => {
      const team = pointsTable[teamId];
      team.goalDiff = team.goalsFor - team.goalsAgainst;
    });

    // Convert the points table to an array and sort by points, then goal difference
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
    const scorers = {};
    let totalGoals = 0;

    league?.matches.forEach((match) => {
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
    const assisters = {};

    league?.matches.forEach((match) => {
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
    const cleanSheetStats = {};

    league?.matches.forEach((match) => {
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

    // Convert to array and sort by total clean sheets
    const sortedStats = Object.values(cleanSheetStats)
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

  return (
    <div
      className="min-h-screen bg-gray-100 p-20 pt-5 max-sm:p-4"
      style={{
        backgroundImage: `url(${dfawallpaper})`,
        backgroundSize: "cover",
      }}
    >
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-screen ">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900 "></div>
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
              className="alert alert-error flex justify-between items-center py-2 mb-4 bg-red-100 border border-red-400 rounded-md"
            >
              <span className="text-red-600">{error}</span>
              <button
                className="text-red-600 font-bold"
                onClick={() => setError(null)}
              >
                x
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mb-6 max-sm:flex-col ">
            <h1 className="text-4xl font-bold mb-6 text-center w-1/2 items-center flex-col flex max-sm:text-xl">
              {league?.image?.url ? (
                <img src={league.image.url} alt={league.leagueName} className="w-12 mb-2 h-12 md:w-14 md:h-14 rounded-full" />
              ) : (
                <BiFootball className="inline-block text-5xl max-sm:text-4xl max-sm:mb-4" />
              )}
              <p className="max-sm:mb-4">  {league?.leagueName} </p>
              <p>Details</p>
              <p className="mb-2 text-sm font-normal mt-2">
                <span className="flex">
                  {new Date(league?.startDate).toLocaleDateString()} -{" "}
                  {new Date(league?.endDate).toLocaleDateString()}
                </span>
              </p>
            </h1>
            <div className="mb-6 p-6 rounded-lg w-1/2 text-sm max-sm:w-full border border-dashed">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700">League Information</p>

                <p className="">
                  <strong>Total Teams:</strong> {league?.teams?.length}
                </p>
              </div>

              <p>
                <strong>Teams:</strong>
              </p>
              <ol className="list-decimal ml-5">
                {league?.teams?.map((team, idx) => (
                  <li key={idx} className=" text-gray-800">
                    {team.teamName}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Points Table Section Start */}
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
              Points Table
            </h2>
            <div className="overflow-x-auto bg-white bg-opacity-90 rounded-lg shadow-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-customDark text-white">
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
                        rowColorClass = "bg-custom bg-opacity-40"; // Promotion zone
                      } else if (idx >= pointsTable.length - 2) {
                        rowColorClass = "bg-red-200 bg-opacity-60"; // Relegation zone
                      } else {
                        rowColorClass = idx % 2 === 0 ? "bg-gray-50 bg-opacity-60" : "bg-white bg-opacity-60"; // Alternating rows
                      }
                    } else {
                      rowColorClass = idx % 2 === 0 ? "bg-gray-50 bg-opacity-60" : "bg-white bg-opacity-60"; // Alternating rows
                    }

                    return (
                      <tr
                        key={idx}
                        className={`${rowColorClass} hover:bg-customDark hover:bg-opacity-20 transition-colors duration-150`}
                      >
                        <td className="py-3 px-4 border-b border-gray-200">
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
                        <td className="py-3 px-4 border-b border-gray-200">
                          <div className="flex items-center">
                            {team.team.image?.url ? (
                              <img
                                src={team.team.image.url}
                                alt={team.team.teamName}
                                className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-customDark2 shadow-md"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 border-2 border-customDark2">
                                <BiFootball className="text-gray-500" />
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

                        <td className="py-3 px-4 text-center border-b border-gray-200">{team.matchesPlayed}</td>
                        <td className="py-3 px-4 text-center border-b border-gray-200 text-customDark font-medium">{team.wins}</td>
                        <td className="py-3 px-4 text-center border-b border-gray-200 text-amber-600 font-medium">{team.draws}</td>
                        <td className="py-3 px-4 text-center border-b border-gray-200 text-primary font-medium">{team.losses}</td>
                        <td className="py-3 px-4 text-center border-b border-gray-200">{team.goalsFor}</td>
                        <td className="py-3 px-4 text-center border-b border-gray-200">{team.goalsAgainst}</td>
                        <td className="py-3 px-4 text-center border-b border-gray-200">
                          {team.goalDiff > 0 ? (
                            <span className="text-customDark">+{team.goalDiff}</span>
                          ) : team.goalDiff < 0 ? (
                            <span className="text-primary">{team.goalDiff}</span>
                          ) : (
                            team.goalDiff
                          )}
                        </td>
                        <td className="py-3 px-4 text-center border-b border-gray-200 font-bold bg-custom bg-opacity-30">{team.points || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700 bg-gray-100 bg-opacity-80 p-3 rounded-lg">
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
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">GP: Games Played</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">W: Wins</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">D: Draws</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">L: Losses</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">GF: Goals For</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">GA: Goals Against</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">GD: Goal Difference</span>
                <span className="px-2 py-1 bg-white bg-opacity-80 rounded-md shadow-sm">PTS: Points</span>
              </div>
            </div>
          </div>
          {/* Points Table Section End */}

          {/* Enhanced Statistics Tabs */}
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
            Statistics
          </h2>
          <div className="bg-white bg-opacity-90 rounded-lg shadow-lg mb-10 overflow-hidden">
            <div className="p-5 rounded-lg max-sm:text-sm">
              <div className="flex justify-between items-center mb-6 max-sm:flex-col">
                <p className="font-semibold text-lg text-customDark">
                  <strong>Total Goals:</strong> {totalGoals}
                </p>
              </div>

              <div>
                {/* Enhanced Tabs */}
                <div className="flex justify-center space-x-4 mb-6 border-b border-gray-200 pb-2">
                  {tableTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTableTab(tab.id)}
                      className={`px-6 py-3 rounded-t-lg transition-colors duration-300 font-medium
                ${acitveTableTab === tab.id
                          ? tab.id === 'topScorers' ? 'bg-customDark text-white shadow-md' :
                            tab.id === 'topAssists' ? 'bg-custom text-customDark2 shadow-md' :
                              'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-100'} 
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
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
                        Top Scorers
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-customDark text-white">
                              <th className="py-3 px-4 text-left font-bold">Rank</th>
                              <th className="py-3 px-4 text-left font-bold">Player</th>
                              <th className="py-3 px-4 text-left font-bold">Team</th>
                              <th className="py-3 px-4 text-center font-bold">Goals</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topScorers.map((scorer, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-gray-50 bg-opacity-60" : "bg-white bg-opacity-60"}>
                                <td className="py-3 px-4 border-b border-gray-200">{i + 1}</td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <div className="flex items-center">
                                    {scorer?.teamLogo ? (
                                      <img src={scorer.teamLogo} alt={scorer.team} className="w-8 h-8 rounded-full mr-3 border-2 border-customDark2 shadow-md" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 border-2 border-customDark2">
                                        <BiFootball className="text-gray-500" />
                                      </div>
                                    )}
                                    <span className="font-medium">{scorer.player}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">{scorer.team}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-center font-bold bg-custom bg-opacity-30">{scorer.score}</td>
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
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
                        Top Assists
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-custom text-customDark2">
                              <th className="py-3 px-4 text-left font-bold">Rank</th>
                              <th className="py-3 px-4 text-left font-bold">Player</th>
                              <th className="py-3 px-4 text-left font-bold">Team</th>
                              <th className="py-3 px-4 text-center font-bold">Assists</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topAssists.map((assister, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-gray-50 bg-opacity-60" : "bg-white bg-opacity-60"}>
                                <td className="py-3 px-4 border-b border-gray-200">{i + 1}</td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                  <div className="flex items-center">
                                    {assister?.teamLogo ? (
                                      <img src={assister.teamLogo} alt={assister.team} className="w-8 h-8 rounded-full mr-3 border-2 border-customDark2 shadow-md" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 border-2 border-customDark2">
                                        <BiFootball className="text-gray-500" />
                                      </div>
                                    )}
                                    <span className="font-medium">{assister.player}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">{assister.team}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-center font-bold bg-custom bg-opacity-30">{assister.score}</td>
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
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
                      Clean Sheets
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-primary text-white">
                            <th className="py-3 px-4 text-left font-bold">Rank</th>
                            <th className="py-3 px-4 text-left font-bold">Team</th>
                            <th className="py-3 px-4 text-left font-bold">Goal Keeper(s)</th>
                            <th className="py-3 px-4 text-center font-bold">Clean Sheets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topCleanSheets.map((stat, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50 bg-opacity-60" : "bg-white bg-opacity-60"}>
                              <td className="py-3 px-4 border-b border-gray-200">{i + 1}</td>
                              <td className="py-3 px-4 border-b border-gray-200">
                                <div className="flex items-center">
                                  {stat?.teamLogo ? (
                                    <img src={stat.teamLogo} alt={stat.teamName} className="w-8 h-8 rounded-full mr-3 border-2 border-customDark2 shadow-md" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 border-2 border-customDark2">
                                      <BiFootball className="text-gray-500" />
                                    </div>
                                  )}
                                  <span className="font-medium">{stat.teamName}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 border-b border-gray-200">
                                {Object.values(stat.goalkeepers)
                                  .map(keeper =>
                                    <span key={keeper.name} className="inline-block bg-gray-100 px-2 py-1 rounded mr-2 mb-1 text-sm">
                                      {keeper.name} <span className="font-semibold">({keeper.count})</span>
                                    </span>
                                  )}
                              </td>
                              <td className="py-3 px-4 border-b border-gray-200 text-center font-bold bg-custom bg-opacity-30">{stat.totalCleanSheets}</td>
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
        ${showMatches ? 'bg-primary text-white hover:bg-red-600' : 'bg-customDark text-white hover:bg-customDark2'} 
        shadow-md focus:outline-none`}
            >
              {showMatches ? "Hide Matches" : "Show Matches"}
            </button>
          </div>
          {showMatches && (
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 max-sm:text-xl mt-10">
              Matches
            </h2>
          )}
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            {showMatches && (
              <>
                {league?.matches?.map((match, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-85 p-5 rounded-lg shadow-lg max-sm:text-sm border-l-4 border-l-customDark hover:border-l-primary transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-custom bg-opacity-30 transform rotate-45 translate-x-8 -translate-y-8"></div>

                    <div className="flex justify-between mb-6 max-sm:flex-col border-b border-gray-200 pb-3">
                      <div className="flex items-center space-x-2">
                        <BiFootball className="text-xl text-customDark" />
                        <p className="font-medium text-customDark2">
                          <strong>Match {idx + 1}:</strong>
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong>{" "}
                          {new Date(match.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong>{" "}
                          {match.time || "Not Available"}
                        </p>
                      </div>
                    </div>

                    {/* Teams section with improved visuals */}
                    <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 bg-opacity-70 rounded-lg">
                      <div className="flex flex-col items-center w-2/5">
                        <div className="w-10 h-10 rounded-full bg-customDark bg-opacity-10 flex items-center justify-center shadow-md mb-2">
                          {match.teamA?.image?.url ? (
                            <img src={match.teamA.image.url} alt={match.teamA?.teamName} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <BiFootball className="text-customDark" />
                          )}
                        </div>
                        <span className="text-center font-medium text-sm">{match.teamA?.teamName}</span>
                      </div>

                      <div className="flex flex-col items-center w-1/5">
                        <div className="text-xl font-bold bg-white rounded-lg py-1 px-4 shadow-md">
                          {match.score?.teamA} - {match.score?.teamB}
                        </div>
                        <span className="mt-2 text-xs px-2 py-1 rounded-full bg-gray-200">VS</span>
                      </div>

                      <div className="flex flex-col items-center w-2/5">
                        <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center shadow-md mb-2">
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
                          <span className="text-sm font-semibold text-customDark2">Winner:</span>
                          <span className="font-medium text-customDark">{match.winner?.teamName}</span>
                        </div>
                      ) : (
                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                          <span className="text-sm font-medium text-gray-500">Match Drawn</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="bg-customDark bg-opacity-10 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="w-2 h-2 rounded-full bg-customDark mr-2"></span>
                          <strong className="text-customDark">Scorers:</strong>
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
                                <span className="text-gray-600 text-xs">
                                  ({typeof scorer.team === 'object'
                                    ? scorer.team.teamName
                                    : "Unknown Team"})
                                </span>
                                <span className="ml-1 bg-white px-2 py-0.5 rounded-full text-xs font-medium">
                                  {scorer?.score}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm italic ml-4 text-gray-500">No Scorers</p>
                        )}
                      </div>

                      <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
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
                                <span className="text-gray-600 text-xs">
                                  ({typeof assist.team === 'object'
                                    ? assist.team.teamName
                                    : "Unknown Team"})
                                </span>
                                <span className="ml-1 bg-white px-2 py-0.5 rounded-full text-xs font-medium">
                                  {assist?.score}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm italic ml-4 text-gray-500">No Assists</p>
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
  );
};

export default AdminLeagueDetails;