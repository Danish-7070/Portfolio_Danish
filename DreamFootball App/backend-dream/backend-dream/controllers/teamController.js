const Team = require("../models/team");
const Player = require("../models/player");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const League = require("../models/league");

module.exports = {
  // Get all teams
  getTeams: async (req, res) => {
    try {
      const teams = await Team.find()
        .populate("players")
        .sort({ createdAt: -1 });
      res.status(200).json({ teams });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single team by id
  getTeam: async (req, res) => {
    try {
      const { id } = req.params;
      const team = await Team.findById(id).populate("players");

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      res.status(200).json({ team });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a new team
  addTeam: async (req, res) => {
    try {
      console.log("Request entered for addTeam");
      const { teamName, players, email, password, city } = req.body;
      console.log("Request body:", req.body);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if team or email already exists
      const teamExists = await Team.findOne({ teamName });
      if (teamExists) {
        return res.status(400).json({ message: "Team already exists" });
      }

      const emailExists = await Team.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create a new team instance
      const team = new Team({
        teamName,
        email,
        password: hashedPassword,
        image: {
          url: req.file.cloudinaryData.url,
          filename: req.file.cloudinaryData.filename,
        },
        players: [], // Initialize with empty array
        city: city || "Other"
      });

      // Save the team first to get its ID
      await team.save();

      // Parse players if it's a JSON string
      let parsedPlayers;
      if (typeof players === 'string') {
        try {
          parsedPlayers = JSON.parse(players);
        } catch (error) {
          console.error("Error parsing players JSON:", error);
          return res.status(400).json({ message: "Invalid players data format" });
        }
      } else {
        parsedPlayers = players || [];
      }

      // Create player documents for each player
      const playerObjects = [];
      for (const playerData of parsedPlayers) {
        const player = new Player({
          name: playerData.name || playerData, // Handle both object format and string format
          team: team._id,
          image: playerData.image || { url: null, filename: null }
        });

        await player.save();
        playerObjects.push(player._id);
      }

      // Update team with player references
      team.players = playerObjects;
      await team.save();

      res.status(201).json({ message: "Team added successfully", team });
    } catch (error) {
      console.error("Error in addTeam:", error);
      res
        .status(500).json({ message: error.message });
    }
  },
  // Update team
  // Update team
  updateTeam: async (req, res) => {
    console.log('req come in updateTeam');

    try {
      const { id } = req.params;
      const { teamName, players, email, city } = req.body;

      console.log('Request teamName:', teamName);
      console.log('Request players:', players);
      console.log('Request email:', email);

      // Find the existing team with populated players
      const team = await Team.findById(id).populate("players");
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      // Update basic team details
      if (teamName) team.teamName = teamName;
      if (email) team.email = email;

      // If a new image is uploaded, update it
      if (req.file) {
        team.image = {
          url: req.file.cloudinaryData.url,
          filename: req.file.cloudinaryData.filename,
        };
      }

      // Handle players update if provided
      if (players) {
        // Parse players JSON if it's a string
        let parsedPlayers;
        try {
          parsedPlayers = typeof players === 'string' ? JSON.parse(players) : players;
        } catch (error) {
          console.error("Error parsing players JSON:", error);
          return res.status(400).json({ message: "Invalid players data format" });
        }



        // Get current player IDs for comparison
        const currentPlayerIds = team.players ? team.players.map(player => player._id.toString()) : [];

        // Identify players to keep, add, or delete
        const updatedPlayerIds = [];
        const playersToAdd = [];

        // Process each player from the request
        for (const playerData of parsedPlayers) {
          // If player has an ID, it's an existing player to keep
          if (playerData._id) {
            updatedPlayerIds.push(playerData._id.toString());

            // Update existing player name if needed
            const existingPlayer = await Player.findById(playerData._id);
            if (existingPlayer && existingPlayer.name !== playerData.name) {
              existingPlayer.name = playerData.name;
              await existingPlayer.save();
            }
          }
          // Otherwise, it's a new player to add
          else {
            const newPlayer = new Player({
              name: playerData.name,
              team: team._id,
              image: playerData.image || { url: null, filename: null }
            });
            await newPlayer.save();
            playersToAdd.push(newPlayer._id);
          }
        }

        // Find players to delete (players that exist in currentPlayerIds but not in updatedPlayerIds)
        const playersToDelete = currentPlayerIds.filter(id => !updatedPlayerIds.includes(id));

        // Delete players that are no longer in the team
        if (playersToDelete.length > 0) {
          await Player.deleteMany({ _id: { $in: playersToDelete } });
        }

        // Update team's players array
        team.players = [...updatedPlayerIds.map(id => id), ...playersToAdd];
      }

      team.city = city || "Other";

      await team.save();

      // Return the updated team with populated players
      const updatedTeam = await Team.findById(id).populate("players");
      res.status(200).json({ message: "Team updated successfully", team: updatedTeam });
    } catch (error) {
      console.error("Error in updateTeam:", error);
      res.status(500).json({ message: error.message });
    }
  },
  // Delete a team
  deleteTeam: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the team
      const team = await Team.findById(id);
      if (!team) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Team not found" });
      }

      // Delete associated players
      await Player.deleteMany({ team: id });

      // Delete the team
      await Team.findByIdAndDelete(id);

      res.status(200).json({ message: "Team and associated players deleted successfully" });
    } catch (error) {

      console.error("Error in deleteTeam:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Add this function to the existing module.exports in teamController.js
// Add this function to the existing module.exports in teamController.js
getTeamsStatistics: async (req, res) => {
  try {
    // Get all leagues with populated match data
    const leagues = await League.find()
      .populate({
        path: 'matches',
        populate: [
          { path: 'teamA' },
          { path: 'teamB' },
          { path: 'winner' },
          { path: 'scorers.team' },
          { path: 'assists.team' }
        ]
      });

    // Get all teams for comprehensive listing
    const allTeams = await Team.find();

    // Initialize stats map with all teams
    const teamStatsMap = {};

    // Initialize teamMatches map to store matches for each team
    const teamMatchesMap = {};

    // Initialize with basic info for all teams
    allTeams.forEach(team => {
      const teamId = team._id.toString();
      teamStatsMap[teamId] = {
        team: {
          _id: teamId,
          teamName: team.teamName,
          image: team.image,
          city: team.city
        },
        goalsScored: 0,
        goalsConceded: 0,
        matchesPlayed: new Set(),
        leaguesParticipated: new Set(),
        winCount: 0,
        lossCount: 0,
        drawCount: 0,
        cleanSheets: 0,
        assistsCount: 0,
        matches: []
      };
      
      teamMatchesMap[teamId] = [];
    });

    // Process all matches in all leagues
    leagues.forEach(league => {
      league.matches.forEach(match => {
        // Skip matches with incomplete data
        if (!match.teamA || !match.teamB || !match.score) return;

        const teamAId = match.teamA._id.toString();
        const teamBId = match.teamB._id.toString();
        const leagueId = league._id.toString();
        
        // Create match object with relevant information
        const matchInfo = {
          _id: match._id,
          date: match.date,
          teamA: match.teamA,
          teamB: match.teamB,
          score: match.score,
          winner: match.winner,
          league: {
            _id: leagueId,
            leagueName: league.leagueName
          }
        };

        // Add match to both teams' match arrays
        if (teamStatsMap[teamAId]) {
          teamMatchesMap[teamAId].push(matchInfo);
        }
        if (teamStatsMap[teamBId]) {
          teamMatchesMap[teamBId].push(matchInfo);
        }

        // Record league participation for both teams
        if (teamStatsMap[teamAId]) {
          teamStatsMap[teamAId].leaguesParticipated.add(leagueId);
        }
        if (teamStatsMap[teamBId]) {
          teamStatsMap[teamBId].leaguesParticipated.add(leagueId);
        }

        // Record match played for both teams
        if (teamStatsMap[teamAId]) {
          teamStatsMap[teamAId].matchesPlayed.add(match._id.toString());
        }
        if (teamStatsMap[teamBId]) {
          teamStatsMap[teamBId].matchesPlayed.add(match._id.toString());
        }

        // Record goals scored and conceded
        if (teamStatsMap[teamAId]) {
          teamStatsMap[teamAId].goalsScored += match.score.teamA || 0;
          teamStatsMap[teamAId].goalsConceded += match.score.teamB || 0;
        }
        if (teamStatsMap[teamBId]) {
          teamStatsMap[teamBId].goalsScored += match.score.teamB || 0;
          teamStatsMap[teamBId].goalsConceded += match.score.teamA || 0;
        }

        // Record win/draw/loss
        if (match.winner) {
          const winnerId = match.winner._id.toString();
          if (teamStatsMap[winnerId]) {
            teamStatsMap[winnerId].winCount += 1;
          }

          // Record loss for the other team
          if (winnerId === teamAId && teamStatsMap[teamBId]) {
            teamStatsMap[teamBId].lossCount += 1;
          } else if (winnerId === teamBId && teamStatsMap[teamAId]) {
            teamStatsMap[teamAId].lossCount += 1;
          }
        } else {
          // Match is a draw
          if (teamStatsMap[teamAId]) {
            teamStatsMap[teamAId].drawCount += 1;
          }
          if (teamStatsMap[teamBId]) {
            teamStatsMap[teamBId].drawCount += 1;
          }
        }

        // Record clean sheets
        if (match.cleanSheets) {
          if (match.cleanSheets.teamA && teamStatsMap[teamAId]) {
            teamStatsMap[teamAId].cleanSheets += 1;
          }
          if (match.cleanSheets.teamB && teamStatsMap[teamBId]) {
            teamStatsMap[teamBId].cleanSheets += 1;
          }
        }

        // Process assists
        match.assists && match.assists.forEach(assist => {
          if (!assist.team) return;

          const assistTeamId = typeof assist.team === 'object'
            ? assist.team._id.toString()
            : assist.team.toString();

          if (teamStatsMap[assistTeamId]) {
            teamStatsMap[assistTeamId].assistsCount += assist.score || 0;
          }
        });
      });
    });

    // Convert Sets to numbers and calculate additional stats
    const teamStatsList = Object.values(teamStatsMap)
      .filter(stat => stat.matchesPlayed.size > 0) // Only include teams that played matches
      .map(stat => {
        const teamId = stat.team._id;
        const matchCount = stat.matchesPlayed.size;
        const leagueCount = stat.leaguesParticipated.size;
        const totalPoints = (stat.winCount * 3) + stat.drawCount;

        // Sort team matches by date in descending order
        const sortedMatches = teamMatchesMap[teamId].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        return {
          ...stat,
          matchesPlayed: matchCount,
          leaguesParticipated: leagueCount,
          points: totalPoints,
          goalsPerMatch: matchCount > 0 ? (stat.goalsScored / matchCount).toFixed(2) : 0,
          goalsConcededPerMatch: matchCount > 0 ? (stat.goalsConceded / matchCount).toFixed(2) : 0,
          winPercentage: matchCount > 0 ? ((stat.winCount / matchCount) * 100).toFixed(1) : 0,
          pointsPerMatch: matchCount > 0 ? (totalPoints / matchCount).toFixed(2) : 0,
          goalDifference: stat.goalsScored - stat.goalsConceded,
          matches: sortedMatches
        };
      })
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

    res.status(200).json({
      success: true,
      data: {
        teams: teamStatsList
      }
    });
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
};