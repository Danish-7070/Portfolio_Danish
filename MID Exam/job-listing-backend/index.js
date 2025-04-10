const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a Job Schema
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  requirements: String,
  applyLink: String,
});

const Job = mongoose.model('Job', jobSchema);

// Fetch and Store Jobs from the External API
app.get('/api/jobs', async (req, res) => {
  try {
    // Fetch jobs from the external API
    const response = await axios.get('https://isonfakery.com/job-posts');
    const jobs = response.data;

    // Save jobs to MongoDB
    await Job.insertMany(jobs);

    res.status(200).json({ message: 'Jobs fetched and stored successfully', jobs });
  } catch (error) {
    console.error('Error fetching or storing jobs:', error);
    res.status(500).json({ error: 'Failed to fetch or store jobs' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});