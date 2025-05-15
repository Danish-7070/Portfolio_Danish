const mongoose = require("mongoose");
const Player = require("./player")
const Schema = mongoose.Schema;

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String
  },
  city: {
    type: String,
    default: "Other",
    enum: ["Rawalpindi", "Islamabad", "Lahore", "Peshawar", "Faisalabad", "Karachi", "Quetta", "Kashmir", "Other"]
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      default: []
    }
  ],
},{timestamps:true});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
