const Review = require("../models/reviews");
const Challenge = require("../models/challenges");
const Ground = require("../models/ground");

module.exports = {
  //get all reviews
  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find();
      return res.status(200).json({ reviews });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  //get active challenges
  getActiveChallenges: async (req, res) => {
    try {
      const challenges = await Challenge.find({ status: "active" });
      return res.status(200).json({ challenges });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  //get all grounds
  getGrounds: async (req, res) => {
    try {
      const grounds = await Ground.find();
      return res.status(200).json({ grounds });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  //delete challenge
};
