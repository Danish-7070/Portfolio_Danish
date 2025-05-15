const jwt = require("jsonwebtoken");
require("dotenv").config();
const Customer = require("../models/customer");

const authMiddlewares = {
  verifyCustomer: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      // console.log(req.headers);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const customer = await Customer.findById(decoded.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      req.customer = customer;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authMiddlewares;
