const TeamRequest = require("../models/teamRequest.js");
const jwt = require("jsonwebtoken");

module.exports = {
    // Get all team requests with future booking times
    getAvailableTeamRequests: async (req, res) => {
        const { teamId } = req.params;

        try {
            const now = new Date();
            console.log('team id comming :', teamId);
            const avaTeamRequests = await TeamRequest.find({
                matchMaker: { $ne: teamId }
            })
                .populate({
                    path: "bookingId",
                    populate: [
                        { path: "ground" },
                        { path: "team" }
                    ]
                })
                .populate("matchMaker")
                .populate("interestedTeams.team")
                .where("bookingId.bookingDate");

            // Filter team requests for future booking dates
            const teamRequests = avaTeamRequests.filter(teamRequest => {
                const bookingDate = new Date(teamRequest.bookingId.bookingDate);
                return bookingDate > now;
            });

            return res.status(200).json({ teamRequests });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getMyTeamRequests: async (req, res) => {
        try {
            const { teamId } = req.params;
            const myTeamRequests = await TeamRequest.find({ matchMaker: teamId })
                .populate({
                    path: "bookingId",
                    populate: [
                        { path: "ground" },
                        { path: "team" }
                    ]
                })
                .populate("interestedTeams.team")
                .populate("matchMaker")
                .where("bookingId.bookingDate")
                .sort("bookingId.bookingDate");
                console.log('myTeamRequests', myTeamRequests);
            res.status(200).json({ myTeamRequests });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new team request
    createTeamRequest: async (req, res) => {
        try {
            const { matchMaker, bookingId } = req.body;

            // Validate input
            if (!matchMaker || !bookingId) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const newTeamRequest = new TeamRequest({
                matchMaker,
                bookingId,
                interestedTeams: [], // Start with an empty array for interested teams
            });

            await newTeamRequest.save();
            return res.status(201).json({ message: "Team request created successfully.", newTeamRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Update a team request to mark as interested by another team
    interestedTeamRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const { teamId, comments } = req.body;

            if (!teamId) {
                return res.status(400).json({ message: "Team ID is required." });
            }

            const teamRequest = await TeamRequest.findById(id);
            if (!teamRequest) {
                return res.status(404).json({ message: "Team request not found." });
            }

            if (!teamRequest.interestedTeams) {
                teamRequest.interestedTeams = [];
            }

            const alreadyInterested = teamRequest.interestedTeams.some(
                (team) => team.team.toString() === teamId
            );

            if (alreadyInterested) {
                return res.status(400).json({ message: "Team has already shown interest." });
            }

            teamRequest.interestedTeams.push({ team: teamId, requestStatus: "pending", comments });
            await teamRequest.save();

            return res.status(200).json({ message: "Interest added successfully.", teamRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Get approved requests for a team
    getApprovedRequests: async (req, res) => {
        try {
            const { teamId } = req.params;

            const approvedRequests = await TeamRequest.find({
                "interestedTeams.team": teamId,
                "interestedTeams.requestStatus": "approved"
            })
                .populate("matchMaker")
                .populate({
                    path: "bookingId",
                    populate: [
                        { path: "ground" },
                        { path: "team" }
                    ]
                })
                .populate("interestedTeams.team");

            return res.status(200).json({ approvedRequests });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateInterestStatus: async (req, res) => {
        const { id, teamId } = req.params;
        const { action } = req.body; // Can be 'approved', 'rejected', or 'pending'

        try {
            const teamRequest = await TeamRequest.findById(id);
            if (!teamRequest) {
                return res.status(404).json({ message: "Team request not found." });
            }

            const interestedTeam = teamRequest.interestedTeams.find(
                team => team.team.toString() === teamId
            );

            if (!interestedTeam) {
                return res.status(404).json({ message: "Team not found in interested teams." });
            }

            // Update the request status
            interestedTeam.requestStatus = action;
            await teamRequest.save();

            return res.status(200).json({ message: "Interest status updated successfully.", teamRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};