const Player = require('../models/player');
const Team = require('../models/team');
const League = require('../models/league');

module.exports = {
    getPlayersStatistics: async (req, res) => {
        try {
            // Get all leagues with populated data
            const leagues = await League.find()
                .populate({
                    path: 'matches',
                    populate: [
                        { path: 'teamA' },
                        { path: 'teamB' },
                        { path: 'scorers.player' },
                        { path: 'assists.player' },
                        { path: 'cleanSheets.goalKeeperA' },
                        { path: 'cleanSheets.goalKeeperB' }
                    ]
                });

            // Get all players for comprehensive listing
            const allPlayers = await Player.find().populate('team');
            
            // Initialize stats map with all players
            const playerStatsMap = {};
            
            // Initialize with basic info for all players
            allPlayers.forEach(player => {
                const playerId = player._id.toString();
                playerStatsMap[playerId] = {
                    player: {
                        _id: playerId,
                        name: player.name,
                        image: player.image,
                        team: {
                            _id: player.team ? player.team._id : null,
                            teamName: player.team ? player.team.teamName : null,
                            image: player.team ? player.team.image : null
                        }
                    },
                    goals: 0,
                    assists: 0,
                    matchesPlayed: new Set(),
                    cleanSheets: 0,
                    winCount: 0,
                    lossCount: 0,
                    drawCount: 0
                };
            });

            // Process all matches in all leagues
            leagues.forEach(league => {
                league.matches.forEach(match => {
                    const teamAId = match.teamA._id.toString();
                    const teamBId = match.teamB._id.toString();
                    const isDraw = match.score.teamA === match.score.teamB;
                    const winningTeamId = !isDraw ? (match.score.teamA > match.score.teamB ? teamAId : teamBId) : null;
                    
                    // Process scorers
                    match.scorers.forEach(scorer => {
                        if (!scorer.player) return; // Skip if player reference is missing
                        
                        const playerId = scorer.player._id.toString();
                        if (playerStatsMap[playerId]) {
                            playerStatsMap[playerId].goals += scorer.score;
                            playerStatsMap[playerId].matchesPlayed.add(match._id.toString());
                            
                            // Update win/loss/draw count
                            const playerTeamId = scorer.team.toString();
                            if (isDraw) {
                                playerStatsMap[playerId].drawCount += 1;
                            } else if (winningTeamId === playerTeamId) {
                                playerStatsMap[playerId].winCount += 1;
                            } else {
                                playerStatsMap[playerId].lossCount += 1;
                            }
                        }
                    });

                    // Process assists
                    match.assists.forEach(assist => {
                        if (!assist.player) return; // Skip if player reference is missing
                        
                        const playerId = assist.player._id.toString();
                        if (playerStatsMap[playerId]) {
                            playerStatsMap[playerId].assists += assist.score;
                            playerStatsMap[playerId].matchesPlayed.add(match._id.toString());
                        }
                    });

                    // Process clean sheets for goalkeepers
                    if (match.cleanSheets.teamA && match.cleanSheets.goalKeeperA) {
                        const goalkeeperId = match.cleanSheets.goalKeeperA._id.toString();
                        if (playerStatsMap[goalkeeperId]) {
                            playerStatsMap[goalkeeperId].cleanSheets += 1;
                            playerStatsMap[goalkeeperId].matchesPlayed.add(match._id.toString());
                        }
                    }

                    if (match.cleanSheets.teamB && match.cleanSheets.goalKeeperB) {
                        const goalkeeperId = match.cleanSheets.goalKeeperB._id.toString();
                        if (playerStatsMap[goalkeeperId]) {
                            playerStatsMap[goalkeeperId].cleanSheets += 1;
                            playerStatsMap[goalkeeperId].matchesPlayed.add(match._id.toString());
                        }
                    }
                });
            });

            // Convert Set to number for matches played and calculate additional stats
            const playerStatsList = Object.values(playerStatsMap).map(stat => {
                const matchCount = stat.matchesPlayed.size;
                return {
                    ...stat,
                    matchesPlayed: matchCount,
                    goalsPerMatch: matchCount > 0 ? (stat.goals / matchCount).toFixed(2) : 0,
                    assistsPerMatch: matchCount > 0 ? (stat.assists / matchCount).toFixed(2) : 0,
                    winPercentage: matchCount > 0 ? ((stat.winCount / matchCount) * 100).toFixed(1) : 0
                };
            });

            res.status(200).json({
                success: true,
                data: {
                    players: playerStatsList
                }
            });
        } catch (error) {
            console.error('Error fetching player statistics:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};