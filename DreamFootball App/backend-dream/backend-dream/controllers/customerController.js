const Customer = require("../models/customer");
const Ground = require("../models/ground");

const jwt = require("jsonwebtoken");

module.exports = {
  getGrounds: async (req, res) => {
    try {
      const grounds = await Ground.find();
      res.status(200).json({ grounds });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getSelf: async (req, res) => {
    try {
      //get id from token
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const customer = await Customer.findById(decoded.id);
      res.status(200).json({ customer });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
