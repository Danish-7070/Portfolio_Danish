const Challenge = require("../models/challenges");
const jwt = require("jsonwebtoken");

module.exports = {
  getChallenges: async (req, res) => {
    try {
      const challenges = await Challenge.find()
        .populate("challengerTeam")
        .populate("challengedTeam")
        .populate("ground");
      return res.status(200).json({ challenges });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getChallengesForTeam: async (req, res) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const teamId = decoded.id;
      const challengesToGet = await Challenge.find({
        challengedTeam: teamId,
      })
        .populate("challengerTeam")
        .populate("challengedTeam")
        .populate("ground")
        .populate({
          path: "challengerTeam",
          populate: {
            path: "players",
            model: "Player",  // Make sure to reference the correct model name for Player
          },
        })
        .populate({
          path: "challengedTeam",
          populate: {
            path: "players",
            model: "Player",  // Make sure to reference the correct model name for Player
          },
        });
       

      return res.status(200).json({ challengesToGet });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  getChallenge: async (req, res) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findById(id)
        .populate("challengerTeam")
        .populate("challengedTeam")
        .populate("ground");
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      return res.status(200).json({ challenge });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteChallenge: async (req, res) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findByIdAndDelete(id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      return res
        .status(200)
        .json({ message: "Challenge deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  addChallenge: async (req, res) => {
    try {
      const { challenged, ground, status, date, time } = req.body;

      console.log(req.body);
      const token = req.headers.authorization;
      console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const challengerTeam = decoded.id;

      const newChallenge = new Challenge({
        challengerTeam,
        challengedTeam: challenged,
        ground,
        status,
        date,
        time,
      });

      await newChallenge.save();
      return res.status(201).json({ message: "Challenge added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  changeChallengeStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const challenge = await Challenge.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      return res.status(200).json({ challenge });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  acceptChallenge: async (req, res) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findByIdAndUpdate(
        id,
        { status: "accepted" },
        { new: true }
      );
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      return res.status(200).json({ challenge });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  rejectChallenge: async (req, res) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findByIdAndUpdate
        (id,
          { status: "rejected" },
          { new: true }
        );
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      return res.status(200).json({ challenge });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // getChallenges: async (req, res) => {
  //   try {
  //     const challenges = await Challenge.find();
  //     return res.status(200).json({ challenges });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },

  // addChallenge: async (req, res) => {
  //   try {
  //     const { title, description, points } = req.body;
  //     const newChallenge = new Challenge({
  //       title,
  //       description,
  //       points,
  //     });
  //     await newChallenge.save();
  //     return res.status(201).json({ message: "Challenge added successfully" });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // },

  // deleteChallenge: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const challenge = await Challenge.findByIdAndDelete(id);
  //     if (!challenge) {
  //       return res.status(404).json({ message: "Challenge not found" });
  //     }
  //     return res
  //       .status(200)
  //       .json({ message: "Challenge deleted successfully" });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
};
