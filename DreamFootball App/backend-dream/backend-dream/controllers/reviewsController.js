const Review = require('../models/reviews');
const Customer = require('../models/customer');

const jwt = require('jsonwebtoken');

module.exports = {
  addReview: async (req, res) => {
    try {
      //get customer id from token
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const customer = await Customer.findById(decoded.id);

      //check if customer has already reviewed
      const leftReview = customer.leftReview;
      if (leftReview) {
        return res.status(400).json({ message: 'You have already reviewed' });
      }

      //create new review
      const { rating, description } = req.body;
      const newReview = new Review({
        rating,
        description,
        by: customer._id,
      });
      await newReview.save();

      //update customer
      customer.leftReview = true;
      await customer.save();

      res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find().populate('by');
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};


