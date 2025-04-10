const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Store user data from Google Login
app.post('/api/users', async (req, res) => {
  const { name, email, profilePicture } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, profilePicture });
      await user.save();
    }
    res.status(201).json({ message: 'User saved or already exists' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch and store job listings
app.get('/api/jobs', async (req, res) => {
  try {
    let jobs = await Job.find();
    if (jobs.length === 0) {
      const response = await axios.get('https://jsonfakery.com/job-posts');
      jobs = response.data.map((job) => ({
        id: job.id || String(Math.random()), // Ensure unique ID
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        applicationLink: job.application_link || job.applicationLink,
      }));
      await Job.insertMany(jobs);
    }
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));