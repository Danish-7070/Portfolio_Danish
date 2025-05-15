const mongoose = require("mongoose");

const interestedPlayersSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
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


const matchRequestSchema = new mongoose.Schema({
    matchMaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    playersRequired: {
        type: Number,
        required: true,
        default:0
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    interestedPlayers:
    {
        type: [interestedPlayersSchema],
        required: false,
        default: []
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MatchRequest", matchRequestSchema);