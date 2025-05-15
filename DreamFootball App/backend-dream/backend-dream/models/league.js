const mongoose = require("mongoose");
const Team = require("./team");
require("./team");

const matchSchema = new mongoose.Schema({
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  score: {
    teamA: { type: Number },
    teamB: { type: Number },
  },
  cleanSheets: {
    teamA: { type: Boolean, default: false },
    teamB: { type: Boolean, default: false },
    goalKeeperA: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Player" 
    },
    goalKeeperB: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Player" 
    }
  },
  scorers: [
    {
      player: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Player" 
      },
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      score: { type: Number },
    },
  ],
  assists: [
    {
      player: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Player" 
      },
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      score: { type: Number },
    },
  ],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null
  },
  date: { type: Date },
  time: { type: String },
  createdAt: { type: Date, default: Date.now },
});


const leagueSchema = new mongoose.Schema({
  leagueName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  matches: [matchSchema],
  image: {
    url: String,
    filename: String
  },
});

const League = mongoose.model("League", leagueSchema);

module.exports = League;