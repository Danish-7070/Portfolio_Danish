const mongoose = require("mongoose");
const Team = require("./team");

const interestedTeamsSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    requestStatus: {
        type: String,
        required: true,
        default: "pending",
    },
    comments:{
        type: String,
        required: false,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}); 


const teamRequestSchema = new mongoose.Schema({
    matchMaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    interestedTeams:
    {
        type: [interestedTeamsSchema],
        required: false,
        default: []
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TeamRequest", teamRequestSchema);