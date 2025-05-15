import React, { useState, useEffect } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import { inputDateFormat } from "../../utils/inputDateFormat";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const EditLeagueForm = ({ leagueData, onSubmit, teamsData }) => {
  const [leagueName, setLeagueName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTeamsData, setSelectedTeamsData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [imageChanged, setImageChanged] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(leagueData.image?.url || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageChanged(true);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setImageChanged(true);
  };

  useEffect(() => {
    setLoading(true);
    if (leagueData) {
      setLeagueName(leagueData.leagueName);
      setImage(leagueData.image);
      setImageChanged(false);
      setStartDate(inputDateFormat(leagueData.startDate));
      setEndDate(inputDateFormat(leagueData.endDate));
      setSelectedTeams(leagueData.teams.map((team) => team._id));
      setSelectedTeamsData(leagueData.teams);
      
      // Process matches, converting player references as needed
      setMatches(leagueData.matches.map(match => {
        return {
          ...match,
          time: match.time || "",
          assists: (match.assists || []).map(assist => ({
            player: typeof assist.player === 'object' ? assist.player._id : assist.player,
            team: typeof assist.team === 'object' ? assist.team._id : assist.team,
            score: assist.score
          })),
          scorers: (match.scorers || []).map(scorer => ({
            player: typeof scorer.player === 'object' ? scorer.player._id : scorer.player,
            team: typeof scorer.team === 'object' ? scorer.team._id : scorer.team,
            score: scorer.score
          })),
          cleanSheets: {
            teamA: match.cleanSheets?.teamA || false,
            teamB: match.cleanSheets?.teamB || false,
            goalKeeperA: typeof match.cleanSheets?.goalKeeperA === 'object' 
              ? match.cleanSheets?.goalKeeperA?._id 
              : match.cleanSheets?.goalKeeperA || "",
            goalKeeperB: typeof match.cleanSheets?.goalKeeperB === 'object'
              ? match.cleanSheets?.goalKeeperB?._id
              : match.cleanSheets?.goalKeeperB || ""
          }
        };
      }));

      // Build available players from teams
      const players = [];
      leagueData.teams.forEach((team) => {
        // Find the complete team data with players
        const teamWithPlayers = teamsData.find(t => t._id === team._id);
        if (teamWithPlayers && teamWithPlayers.players) {
          teamWithPlayers.players.forEach(player => {
            players.push({
              teamId: team._id,
              playerId: typeof player === 'object' ? player._id : player,
              playerName: typeof player === 'object' ? player.name : player
            });
          });
        }
      });
      setAvailablePlayers(players);
    }
    setLoading(false);
  }, [leagueData, teamsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!leagueName || !startDate || !endDate || selectedTeams.length === 0) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const updatedMatches = matches.map((match) => ({
      _id: match._id || undefined,
      teamA: match.teamA._id || match.teamA,
      teamB: match.teamB._id || match.teamB,
      score: match.score,
      scorers: (match.scorers || []).map(scorer => ({
        player: scorer.player, // Now player is already an ObjectId
        team: scorer.team,
        score: Number(scorer.score || 0)
      })),
      assists: (match.assists || []).map(assist => ({
        player: assist.player, // Now player is already an ObjectId
        team: assist.team,
        score: Number(assist.score || 0)
      })),
      cleanSheets: {
        teamA: match.score.teamB === 0,
        teamB: match.score.teamA === 0,
        goalKeeperA: match.score.teamB === 0 ? match.cleanSheets.goalKeeperA : null,
        goalKeeperB: match.score.teamA === 0 ? match.cleanSheets.goalKeeperB : null
      },
      date: match.date,
      time: match.time,
      winner: match.winner,
    }));

    try {
      const updatedLeague = new FormData();
      
      if (imageChanged && image) {
        updatedLeague.append("image", image);
      } else if (!imageChanged && image) {
        updatedLeague.append("image", leagueData?.image?.filename);
      }
      
      updatedLeague.append("leagueName", leagueName);
      updatedLeague.append("startDate", startDate);
      updatedLeague.append("endDate", endDate);
      updatedLeague.append("teams", JSON.stringify(selectedTeams));
      updatedLeague.append("matches", JSON.stringify(updatedMatches));

      await onSubmit(updatedLeague);
    } catch (error) {
      console.error("Error updating league:", error);
      setError(error?.message || "Error updating League");
    } finally {
      setLoading(false);
    }
  };

  const addMatch = () => {
    setMatches([
      ...matches,
      {
        teamA: "",
        teamB: "",
        score: { teamA: 0, teamB: 0 },
        scorers: [],
        assists: [],
        cleanSheets: {
          teamA: false,
          teamB: false,
          goalKeeperA: "",
          goalKeeperB: ""
        },
        date: "",
        time: "",
        winner: "",
      },
    ]);
  };

  const removeMatch = (index) => {
    const newMatches = matches.filter((_, i) => i !== index);
    setMatches(newMatches);
  };

  const addScorer = (matchIndex) => {
    const newMatches = [...matches];
    newMatches[matchIndex].scorers.push({ player: "", team: "", score: 0 });
    setMatches(newMatches);
  };

  const removeScorer = (matchIndex, scorerIndex) => {
    const newMatches = [...matches];
    newMatches[matchIndex].scorers = newMatches[matchIndex].scorers.filter(
      (_, i) => i !== scorerIndex
    );
    setMatches(newMatches);
  };

  const addAssist = (matchIndex) => {
    const newMatches = [...matches];
    newMatches[matchIndex].assists.push({ player: "", team: "", score: 0 });
    setMatches(newMatches);
  };

  const removeAssist = (matchIndex, assistIndex) => {
    const newMatches = [...matches];
    newMatches[matchIndex].assists = newMatches[matchIndex].assists.filter(
      (_, i) => i !== assistIndex
    );
    setMatches(newMatches);
  };

  const handleTeamChange = (teamId) => {
    // Toggle selected team
    const newSelectedTeams = selectedTeams.includes(teamId)
      ? selectedTeams.filter(id => id !== teamId)
      : [...selectedTeams, teamId];
    
    setSelectedTeams(newSelectedTeams);
    
    // Update selectedTeamsData to match
    const newSelectedTeamsData = teamsData.filter(team => 
      newSelectedTeams.includes(team._id)
    );
    setSelectedTeamsData(newSelectedTeamsData);
    
    // Update available players
    const newAvailablePlayers = [];
    newSelectedTeamsData.forEach(team => {
      if (team.players && team.players.length > 0) {
        team.players.forEach(player => {
          newAvailablePlayers.push({
            teamId: team._id,
            playerId: typeof player === 'object' ? player._id : player,
            playerName: typeof player === 'object' ? player.name : player
          });
        });
      }
    });
    
    setAvailablePlayers(newAvailablePlayers);
  };

  const getTeamById = (teamId) => {
    const team = teamsData.find((team) => team._id === teamId);
    return team ? team.teamName : "Unknown Team";
  };

  const getPlayerById = (playerId) => {
    const player = availablePlayers.find(p => p.playerId === playerId);
    return player ? player.playerName : "Unknown Player";
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${dfawallpaper})`,
            backgroundSize: "cover",
          }}
        >
          <AdminSiderbar />
          <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3 mt-6 max-sm:mt-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-3/4 mx-auto"
            >
              <h1 className="text-2xl font-bold">Edit League</h1>

              {error && (
                <div className="alert alert-error leading-tight flex justify-between py-1">
                  <span>{error}</span>
                  <button 
                    type="button" 
                    className="btn btn-sm border-none" 
                    onClick={() => setError(null)}
                  >
                    x
                  </button>
                </div>
              )}

              <div className="form-group">
                <label className="text-gray-500">League Image</label>
                <div className="mt-2">
                  {previewUrl ? (
                    <div className="relative w-full h-60">
                      <img
                        src={previewUrl}
                        alt="League preview"
                        className="w-40 h-40 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload size={24} className="text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <label className="text-gray-500">League Name</label>
              <input
                type="text"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                className="rounded-md p-3 border border-gray-300"
                required
              />

              <label className="text-gray-500">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md p-3 border border-gray-300"
                required
              />

              <label className="text-gray-500">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md p-3 border border-gray-300"
                required
              />

              <div className="flex flex-col gap-4">
                <label className="text-gray-500">Teams</label>
                {teamsData.map((team) => (
                  <div key={team._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team._id)}
                      onChange={() => handleTeamChange(team._id)}
                      className="rounded"
                    />
                    <span>{team.teamName}</span>
                  </div>
                ))}
              </div>

              {matches.map((match, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border p-4 rounded-md border-gray-300"
                >
                  <label className="text-gray-500 font-bold">Match {index + 1}</label>
                  <div className="flex gap-4">
                    <div className="flex flex-col w-1/2">
                      <label className="text-gray-500">Team A</label>
                      <select
                        value={typeof match.teamA === 'object' ? match.teamA._id : match.teamA}
                        onChange={(e) => {
                          const newMatches = [...matches];
                          newMatches[index].teamA = e.target.value;
                          setMatches(newMatches);
                        }}
                        className="rounded-md p-3 border border-gray-300"
                        required
                      >
                        <option value="">Select Team A</option>
                        {selectedTeamsData.filter((tm) => {
                          const teamBId = typeof match.teamB === 'object' ? match.teamB._id : match.teamB;
                          return !teamBId || tm._id !== teamBId;
                        }).map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.teamName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="text-gray-500">Team B</label>
                      <select
                        value={typeof match.teamB === 'object' ? match.teamB._id : match.teamB}
                        onChange={(e) => {
                          const newMatches = [...matches];
                          newMatches[index].teamB = e.target.value;
                          setMatches(newMatches);
                        }}
                        className="rounded-md p-3 border border-gray-300"
                        required
                      >
                        <option value="">Select Team B</option>
                        {selectedTeamsData.filter((tm) => {
                          const teamAId = typeof match.teamA === 'object' ? match.teamA._id : match.teamA;
                          return !teamAId || tm._id !== teamAId;
                        }).map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.teamName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-1/2">
                      <label className="text-gray-500">
                        Score (Team A : Team B)
                      </label>
                      <input
                        type="text"
                        value={`${match.score.teamA}:${match.score.teamB}`}
                        onChange={(e) => {
                          const [scoreA, scoreB] = e.target.value
                            .split(":")
                            .map(Number);
                          const newMatches = [...matches];
                          newMatches[index].score = {
                            teamA: isNaN(scoreA) ? 0 : scoreA,
                            teamB: isNaN(scoreB) ? 0 : scoreB,
                          };
                          setMatches(newMatches);
                        }}
                        className="rounded-md p-3 border border-gray-300"
                      />
                    </div>

                    {/* Scorers */}
                    <div className="flex flex-col w-full">
                      <label className="text-gray-500">Scorers</label>
                      {match.scorers.map((scorer, scorerIndex) => (
                        <div key={scorerIndex} className="flex gap-2">
                          <select
                            value={scorer.player}
                            onChange={(e) => {
                              const selectedPlayerId = e.target.value;
                              const player = availablePlayers.find(p => p.playerId === selectedPlayerId);
                              
                              const newMatches = [...matches];
                              newMatches[index].scorers[scorerIndex] = {
                                ...newMatches[index].scorers[scorerIndex],
                                player: selectedPlayerId,
                                team: player ? player.teamId : ""
                              };
                              setMatches(newMatches);
                            }}
                            className="rounded-md p-3 border border-gray-300 w-2/3"
                            required
                          >
                            <option value="">Select Player</option>
                            {availablePlayers
                              .filter(player => {
                                const teamAId = typeof match.teamA === 'object' ? match.teamA._id : match.teamA;
                                const teamBId = typeof match.teamB === 'object' ? match.teamB._id : match.teamB;
                                return player.teamId === teamAId || player.teamId === teamBId;
                              })
                              .map(player => (
                                <option key={player.playerId} value={player.playerId}>
                                  {player.playerName}
                                </option>
                              ))
                            }
                          </select>
                          <input
                            type="text"
                            value={scorer.team ? getTeamById(scorer.team) : ""}
                            readOnly
                            className="rounded-md p-3 border border-gray-300 w-1/3"
                          />
                          <input
                            type="number"
                            placeholder="Score"
                            value={scorer.score || 0}
                            className="rounded-md p-3 border border-gray-300 w-1/3"
                            onChange={(e) => {
                              const newMatches = [...matches];
                              newMatches[index].scorers[scorerIndex].score = 
                                Number(e.target.value);
                              setMatches(newMatches);
                            }}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeScorer(index, scorerIndex)}
                            className="btn btn-secondary"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addScorer(index)}
                        className="mt-2 bg-secondary text-white rounded-md py-1"
                      >
                        + Add Scorer
                      </button>
                    </div>

                    {/* Assists */}
                    <div className="flex flex-col w-full">
                      <label className="text-gray-500">Assists</label>
                      {match.assists.map((assist, assistIndex) => (
                        <div key={assistIndex} className="flex gap-2">
                          <select
                            value={assist.player}
                            onChange={(e) => {
                              const selectedPlayerId = e.target.value;
                              const player = availablePlayers.find(p => p.playerId === selectedPlayerId);
                              
                              const newMatches = [...matches];
                              newMatches[index].assists[assistIndex] = {
                                ...newMatches[index].assists[assistIndex],
                                player: selectedPlayerId,
                                team: player ? player.teamId : ""
                              };
                              setMatches(newMatches);
                            }}
                            className="rounded-md p-3 border border-gray-300 w-2/3"
                            required
                          >
                            <option value="">Select Player</option>
                            {availablePlayers
                              .filter(player => {
                                const teamAId = typeof match.teamA === 'object' ? match.teamA._id : match.teamA;
                                const teamBId = typeof match.teamB === 'object' ? match.teamB._id : match.teamB;
                                return player.teamId === teamAId || player.teamId === teamBId;
                              })
                              .map(player => (
                                <option key={player.playerId} value={player.playerId}>
                                  {player.playerName}
                                </option>
                              ))
                            }
                          </select>
                          <input
                            type="text"
                            value={assist.team ? getTeamById(assist.team) : ""}
                            readOnly
                            className="rounded-md p-3 border border-gray-300 w-1/3"
                          />
                          <input
                            type="number"
                            placeholder="Assists"
                            value={assist.score || 0}
                            className="rounded-md p-3 border border-gray-300 w-1/3"
                            onChange={(e) => {
                              const newMatches = [...matches];
                              newMatches[index].assists[assistIndex].score = 
                                Number(e.target.value);
                              setMatches(newMatches);
                            }}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeAssist(index, assistIndex)}
                            className="btn btn-secondary"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addAssist(index)}
                        className="mt-2 bg-secondary text-white rounded-md py-1"
                      >
                        + Add Assist
                      </button>
                    </div>
                  </div>

                  <label className="text-gray-500">Winner</label>
                  <select
                    value={match.winner || "Draw"}
                    onChange={(e) => {
                      const newMatches = [...matches];
                      newMatches[index].winner = e.target.value === "Draw" ? null : e.target.value;
                      // console.log('e.target.value', e.target.value);
                      setMatches(newMatches);
                    }}
                    className="rounded-md p-3 border border-gray-300"
                    required
                  >
                    <option value="">Select Winner</option>
                    {match.teamA && (
                      <option value={typeof match.teamA === 'object' ? match.teamA._id : match.teamA}>
                        {typeof match.teamA === 'object' 
                         ? match.teamA.teamName 
                         : getTeamById(match.teamA)}
                     </option>
                   )}
                   {match.teamB && (
                     <option value={typeof match.teamB === 'object' ? match.teamB._id : match.teamB}>
                       {typeof match.teamB === 'object' 
                         ? match.teamB.teamName 
                         : getTeamById(match.teamB)}
                     </option>
                   )}
                   <option value="Draw">Draw</option>
                 </select>

                 {/* Clean Sheet Goalkeepers - Show only when either team has a score of 0 */}
                 {(match.score.teamA === 0 || match.score.teamB === 0) && (
                   <div className="flex gap-4 mt-4">
                     {/* Team A Goalkeeper */}
                     {match.score.teamB === 0 && (
                       <div className="flex flex-col w-1/2">
                         <label className="text-gray-500">Team A Goalkeeper (Clean Sheet)</label>
                         <select
                           value={match.cleanSheets?.goalKeeperA || ""}
                           onChange={(e) => {
                             const newMatches = [...matches];
                             if (!newMatches[index].cleanSheets) {
                               newMatches[index].cleanSheets = {
                                 teamA: match.score.teamB === 0,
                                 teamB: match.score.teamA === 0,
                                 goalKeeperA: "",
                                 goalKeeperB: ""
                               };
                             }
                             newMatches[index].cleanSheets.goalKeeperA = e.target.value;
                             setMatches(newMatches);
                           }}
                           className="rounded-md p-3 border border-gray-300"
                           required
                         >
                           <option value="">Select Goalkeeper</option>
                           {availablePlayers
                             .filter(player => {
                               const teamAId = typeof match.teamA === 'object' ? match.teamA._id : match.teamA;
                               return player.teamId === teamAId;
                             })
                             .map((player) => (
                               <option key={player.playerId} value={player.playerId}>
                                 {player.playerName}
                               </option>
                             ))}
                         </select>
                       </div>
                     )}

                     {/* Team B Goalkeeper */}
                     {match.score.teamA === 0 && (
                       <div className="flex flex-col w-1/2">
                         <label className="text-gray-500">Team B Goalkeeper (Clean Sheet)</label>
                         <select
                           value={match.cleanSheets?.goalKeeperB || ""}
                           onChange={(e) => {
                             const newMatches = [...matches];
                             if (!newMatches[index].cleanSheets) {
                               newMatches[index].cleanSheets = {
                                 teamA: match.score.teamB === 0,
                                 teamB: match.score.teamA === 0,
                                 goalKeeperA: "",
                                 goalKeeperB: ""
                               };
                             }
                             newMatches[index].cleanSheets.goalKeeperB = e.target.value;
                             setMatches(newMatches);
                           }}
                           className="rounded-md p-3 border border-gray-300"
                           required
                         >
                           <option value="">Select Goalkeeper</option>
                           {availablePlayers
                             .filter(player => {
                               const teamBId = typeof match.teamB === 'object' ? match.teamB._id : match.teamB;
                               return player.teamId === teamBId;
                             })
                             .map((player) => (
                               <option key={player.playerId} value={player.playerId}>
                                 {player.playerName}
                               </option>
                             ))}
                         </select>
                       </div>
                     )}
                   </div>
                 )}

                 <label className="text-gray-500">Match Date</label>
                 <input
                   type="date"
                   value={inputDateFormat(match.date)}
                   onChange={(e) => {
                     const newMatches = [...matches];
                     newMatches[index].date = e.target.value;
                     setMatches(newMatches);
                   }}
                   className="rounded-md p-3 border border-gray-300"
                   required
                 />

                 <label className="text-gray-500">Match Time</label>
                 <input
                   type="time"
                   value={match.time || ""}
                   onChange={(e) => {
                     const newMatches = [...matches];
                     newMatches[index].time = e.target.value;
                     setMatches(newMatches);
                   }}
                   className="rounded-md p-3 border border-gray-300"
                 />

                 <button
                   type="button"
                   onClick={() => removeMatch(index)}
                   className="btn btn-secondary"
                 >
                   Remove Match
                 </button>
               </div>
             ))}

             <button
               type="button"
               onClick={addMatch}
               className="mt-4 bg-secondary text-white rounded-md py-2"
             >
               + Add Match
             </button>

             <button
               type="submit"
               className="mt-4 bg-primary text-white rounded-md py-2"
               disabled={loading}
             >
               {loading ? "Updating..." : "Update League"}
             </button>
           </form>
         </div>
       </div>
     )}
   </>
 );
};

export default EditLeagueForm;