const MatchRequest = require("../models/matchRequest.js")
const jwt = require("jsonwebtoken");

module.exports = {
    // Get all match requests with future booking times
    getAvailableMatchRequests: async (req, res) => {

        const token = req.headers.authorization;
        console.log(req.headers);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const customer = await Customer.findById(decoded.id);
        const customerId = decoded.id;
        console.log('customer id', customerId);

        try {

            const now = new Date(); // Get the current date and time

            const avaMatchRequests = await MatchRequest.find({
                matchMaker: { $ne: customerId }
            })
                .populate({
                    path: "bookingId",
                    populate: [
                        { path: "ground" },
                        { path: "team" },
                        { path: "customer" }
                    ]
                })
                .populate("matchMaker")
                .populate("interestedPlayers.player")
                .where("bookingId.bookingDate");

            // Filter match requests for future booking dates
            const matchRequests = avaMatchRequests.filter(matchRequest => {
                const bookingDate = new Date(matchRequest.bookingId.bookingDate);
                return bookingDate > now; // Only include requests with future booking dates
            });


            return res.status(200).json({ matchRequests });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getMyMatches: async (req, res) => {
        try {
            const { customerId } = req.params;
            const myMatches = await MatchRequest.find({ matchMaker: customerId })
            .populate({
                path: "bookingId",
                populate: [
                    { path: "ground" },
                    { path: "team" },
                    { path: "customer" }
                ]
            })
                .populate("interestedPlayers.player")
                .populate("matchMaker")
                .where("bookingId.bookingDate")
                .sort("bookingId.bookingDate");
            res.status(200).json({ myMatches });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new match request
    createMatchRequest: async (req, res) => {
        try {
            const { matchMaker, playersRequired, bookingId } = req.body;

            // Validate input
            if (!matchMaker || !playersRequired || !bookingId) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const newMatchRequest = new MatchRequest({
                matchMaker,
                playersRequired,
                bookingId,
                interestedPlayers: [], // Start with an empty array for interested players
            });

            await newMatchRequest.save();
            return res.status(201).json({ message: "Match request created successfully.", newMatchRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Update a match request to mark as interested by another player
    interestedMatchRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const { playerId , comments} = req.body; // ID of the player showing interest

            // Validate input
            if (!playerId) {
                return res.status(400).json({ message: "Player ID is required." });
            }

            const matchRequest = await MatchRequest.findById(id);
            if (!matchRequest) {
                return res.status(404).json({ message: "Match request not found." });
            }

            // Initialize interestedPlayers if it's empty
            if (!matchRequest.interestedPlayers) {
                matchRequest.interestedPlayers = [];
            }

            // Check if the player is already interested
            const alreadyInterested = matchRequest.interestedPlayers.some(
                (player) => player.player.toString() === playerId
            );

            if (alreadyInterested) {
                return res.status(400).json({ message: "Player has already shown interest." });
            }

            // Add the interested player
            matchRequest.interestedPlayers.push({ player: playerId, requestStatus: "pending", comments });
            await matchRequest.save();

            return res.status(200).json({ message: "Interest added successfully.", matchRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Reject a match request for a specific player
    rejectMatchRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const { playerId } = req.body; // ID of the player rejecting the request

            const matchRequest = await MatchRequest.findById(id);
            if (!matchRequest) {
                return res.status(404).json({ message: "Match request not found." });
            }

            // Initialize interestedPlayers if it's empty
            if (!matchRequest.interestedPlayers || matchRequest.interestedPlayers.length === 0) {
                return res.status(404).json({ message: "No interested players to reject." });
            }

            // Find the interested player and update their status
            const interestedPlayer = matchRequest.interestedPlayers.find(
                (player) => player.player.toString() === playerId
            );

            if (!interestedPlayer) {
                return res.status(404).json({ message: "Player not found in interested players." });
            }

            // Update the request status to "rejected"
            interestedPlayer.requestStatus = "rejected";
            await matchRequest.save();

            return res.status(200).json({ message: "Interest rejected successfully.", matchRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Get approved requests for a customer
    getApprovedRequests: async (req, res) => {
        try {
            const { customerId } = req.params; // Get customer ID from params

            const approvedRequests = await MatchRequest.find({
                "interestedPlayers.player": customerId,
                "interestedPlayers.requestStatus": "approved"
            })
                .populate("matchMaker")
                .populate("bookingId")
                .populate("bookingId.ground")
                .populate("bookingId.team")
                .populate("bookingId.customer")
                .populate("interestedPlayers.player");

            return res.status(200).json({ approvedRequests });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateInterestStatus: async (req, res) => {
        const { id, playerId } = req.params;
        const { action } = req.body; // Can be 'accepted', 'rejected', or 'pending'
        console.log('request came:', id, playerId, action);

        try {
            const matchRequest = await MatchRequest.findById(id);
            if (!matchRequest) {
                return res.status(404).json({ message: "Match request not found." });
            }

            const interestedPlayer = matchRequest.interestedPlayers.find(
                player => player.player.toString() === playerId
            );

            if (!interestedPlayer) {
                return res.status(404).json({ message: "Player not found in interested players." });
            }

            // Update the request status
            interestedPlayer.requestStatus = action;
            if (action === "approved") {
                matchRequest.playersRequired = matchRequest.playersRequired - 1;
            }
            if (action === "rejected") {
                matchRequest.playersRequired = matchRequest.playersRequired + 1;
            }
            await matchRequest.save();

            return res.status(200).json({ message: "Interest status updated successfully.", matchRequest });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
