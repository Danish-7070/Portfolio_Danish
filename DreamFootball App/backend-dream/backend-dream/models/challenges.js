// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const challengeSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     points: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         default: 'deactived',
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model('Challenge', challengeSchema);

//example post request
// {
//     "title": "challenge",  
//     "description": "challenge description",
//     "points": 100,
//     "category": "category"
// }



const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  challengerTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  challengedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  ground: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ground",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Challenge = mongoose.model("Challenge", ChallengeSchema);

module.exports = Challenge;
