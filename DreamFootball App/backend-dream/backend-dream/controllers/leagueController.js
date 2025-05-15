const mongoose = require("mongoose");
const League = require("../models/league");
const Team = require("../models/team");
const Player = require("../models/player");

module.exports = {
    // Get all leagues
    getLeagues: async (req, res) => {
        try {
            const leagues = await League.find()
                .populate({
                    path: "teams",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.teamA",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.teamB",
                    populate: { path: "players" }
                })
                // .populate({
                //     path: "matches.winner",
                //     populate: { path: "players" }
                // })
                .populate({
                    path: "matches.scorers.team",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.assists.team",
                    populate: { path: "players" }
                })
                .populate("matches.scorers.player")
                .populate("matches.assists.player")
                .populate("matches.cleanSheets.goalKeeperA")
                .populate("matches.cleanSheets.goalKeeperB");
                
            res.status(200).json({ leagues });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a league
    getLeague: async (req, res) => {
        try {
            const { id } = req.params;
            const league = await League.findById(id)
                .populate({
                    path: "teams",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.teamA",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.teamB",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.winner",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.scorers.team",
                    populate: { path: "players" }
                })
                .populate({
                    path: "matches.assists.team",
                    populate: { path: "players" }
                })
                .populate("matches.scorers.player")
                .populate("matches.assists.player")
                .populate("matches.cleanSheets.goalKeeperA")
                .populate("matches.cleanSheets.goalKeeperB");

            if (!league) {
                return res.status(404).json({ message: "League not found" });
            }
            res.status(200).json({ league });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add a new league
    addLeague: async (req, res) => {
        try {
            console.log('Request Body:', req.body);
            const { leagueName, startDate, endDate, teams, matches } = req.body;

            // Parse teams if it's a string (in case it's coming as a JSON string)
            const parsedTeams = Array.isArray(teams) ? teams : JSON.parse(teams);

            // Parse matches with the updated function that works with player references
            const parsedMatches = await parseMatches(matches);

            const newLeague = new League({
                leagueName,
                startDate,
                endDate,
                teams: parsedTeams,
                matches: parsedMatches,
                image: {
                    url: req.file.cloudinaryData.url,
                    filename: req.file.cloudinaryData.filename,
                },
            });
            
            await newLeague.save();
            
            res.status(201).json({ message: "League added successfully" });
        } catch (error) {
            console.error("Error in addLeague:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Update a league
    updateLeague: async (req, res) => {
        try {
            console.log('req.body:', req.body);
            const { id } = req.params;
            const { leagueName, startDate, endDate, teams, matches } = req.body;
            
            const league = await League.findById(id);
            if (!league) {
                return res.status(404).json({ message: "League not found" });
            }

            const parsedTeams = Array.isArray(teams) ? teams : JSON.parse(teams);

            // Parse matches with the updated function that works with player references
            const parsedMatches = await parseMatches(matches);

            if (req?.file?.cloudinaryData?.url) {
                league.image = {
                    url: req.file.cloudinaryData.url,
                    filename: req.file.cloudinaryData.filename,
                };
            }
            
            league.leagueName = leagueName;
            league.startDate = startDate;
            league.endDate = endDate;
            league.teams = parsedTeams;
            league.matches = parsedMatches;
            
            await league.save();
            
            res.status(200).json({ message: "League updated successfully" });
        } catch (error) {
            console.error("Error in updateLeague:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a league
    deleteLeague: async (req, res) => {
        try {
            const { id } = req.params;
            const league = await League.findByIdAndDelete(id);
            if (!league) {
                return res.status(404).json({ message: "League not found" });
            }
            res.status(200).json({ message: "League deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

const parseMatches = async (matches) => {
    if (!matches) return [];

    try {
        const parsedData = typeof matches === 'string' ? JSON.parse(matches) : matches;
        
        if (!Array.isArray(parsedData)) {
            return [];
        }
        
        // Process each match to ensure player references are correct
        const processedMatches = await Promise.all(parsedData.map(async match => {
            // Process scorers to ensure they reference player documents
            let processedScorers = [];
            if (match.scorers && Array.isArray(match.scorers)) {
                processedScorers = await Promise.all(match.scorers.map(async scorer => {
                    // If scorer.player is already an ObjectId or valid string ID, use it
                    let playerId = scorer.player;
                    
                    // If it's a player name, try to find or create the player
                    if (typeof scorer.player === 'string' && !mongoose.Types.ObjectId.isValid(scorer.player)) {
                        // Find the team first
                        const team = await Team.findById(scorer.team);
                        if (team) {
                            // Look for a player with this name in the team
                            const existingPlayer = await Player.findOne({ 
                                name: scorer.player,
                                team: team._id 
                            });
                            
                            if (existingPlayer) {
                                playerId = existingPlayer._id;
                            } else {
                                // Create a new player if not found
                                const newPlayer = new Player({
                                    name: scorer.player,
                                    team: team._id
                                });
                                
                                await newPlayer.save();
                                
                                // Add the player to the team
                                team.players.push(newPlayer._id);
                                await team.save();
                                
                                playerId = newPlayer._id;
                            }
                        }
                    }
                    
                    return {
                        player: playerId,
                        team: scorer.team,
                        score: Number(scorer.score)
                    };
                }));
            }
            
            // Process assists similarly to scorers
            let processedAssists = [];
            if (match.assists && Array.isArray(match.assists)) {
                processedAssists = await Promise.all(match.assists.map(async assist => {
                    // If assist.player is already an ObjectId or valid string ID, use it
                    let playerId = assist.player;
                    
                    // If it's a player name, try to find or create the player
                    if (typeof assist.player === 'string' && !mongoose.Types.ObjectId.isValid(assist.player)) {
                        // Find the team first
                        const team = await Team.findById(assist.team);
                        if (team) {
                            // Look for a player with this name in the team
                            const existingPlayer = await Player.findOne({ 
                                name: assist.player,
                                team: team._id 
                            });
                            
                            if (existingPlayer) {
                                playerId = existingPlayer._id;
                            } else {
                                // Create a new player if not found
                                const newPlayer = new Player({
                                    name: assist.player,
                                    team: team._id
                                });
                                
                                await newPlayer.save();
                                
                                // Add the player to the team
                                team.players.push(newPlayer._id);
                                await team.save();
                                
                                playerId = newPlayer._id;
                            }
                        }
                    }
                    
                    return {
                        player: playerId,
                        team: assist.team,
                        score: Number(assist.score)
                    };
                }));
            }
            
            // Process goalkeepers for clean sheets
            let cleanSheets = {
                teamA: Boolean(match.cleanSheets?.teamA),
                teamB: Boolean(match.cleanSheets?.teamB),
                goalKeeperA: match.cleanSheets?.goalKeeperA || null,
                goalKeeperB: match.cleanSheets?.goalKeeperB || null
            };
            
            // Convert goalkeeper names to player references if needed
            if (typeof cleanSheets.goalKeeperA === 'string' && 
                !mongoose.Types.ObjectId.isValid(cleanSheets.goalKeeperA) && 
                cleanSheets.goalKeeperA.trim() !== '') {
                // Find or create player for goalkeeper A
                const team = await Team.findById(match.teamA);
                if (team) {
                    const existingPlayer = await Player.findOne({ 
                        name: cleanSheets.goalKeeperA,
                        team: team._id 
                    });
                    
                    if (existingPlayer) {
                        cleanSheets.goalKeeperA = existingPlayer._id;
                    } else {
                        const newPlayer = new Player({
                            name: cleanSheets.goalKeeperA,
                            team: team._id
                        });
                        
                        await newPlayer.save();
                        
                        team.players.push(newPlayer._id);
                        await team.save();
                        
                        cleanSheets.goalKeeperA = newPlayer._id;
                    }
                }
            }
            
            if (typeof cleanSheets.goalKeeperB === 'string' && 
                !mongoose.Types.ObjectId.isValid(cleanSheets.goalKeeperB) && 
                cleanSheets.goalKeeperB.trim() !== '') {
                // Find or create player for goalkeeper B
                const team = await Team.findById(match.teamB);
                if (team) {
                    const existingPlayer = await Player.findOne({ 
                        name: cleanSheets.goalKeeperB,
                        team: team._id 
                    });
                    
                    if (existingPlayer) {
                        cleanSheets.goalKeeperB = existingPlayer._id;
                    } else {
                        const newPlayer = new Player({
                            name: cleanSheets.goalKeeperB,
                            team: team._id
                        });
                        
                        await newPlayer.save();
                        
                        team.players.push(newPlayer._id);
                        await team.save();
                        
                        cleanSheets.goalKeeperB = newPlayer._id;
                    }
                }
            }
            
            return {
                teamA: match.teamA,
                teamB: match.teamB,
                score: {
                    teamA: Number(match.score?.teamA || 0),
                    teamB: Number(match.score?.teamB || 0)
                },
                cleanSheets: cleanSheets,
                scorers: processedScorers,
                assists: processedAssists,
                winner: match.winner || null,
                date: match.date ? new Date(match.date) : new Date(),
                time: match.time || ''
            };
        }));
        
        return processedMatches;
    } catch (error) {
        console.error('Error parsing matches:', error);
        return [];
    }
};