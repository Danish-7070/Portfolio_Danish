const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://dani:123@cluster0.qkz6bpk.mongodb.net/ticket-booking?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Movie Schema
const movieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  poster_path: String,
  release_date: String,
  vote_average: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

// Fetch and Store Movies from TheMovieDB API
const fetchAndStoreMovies = async () => {
  try {
    const response = await axios.get(
      'https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_TICKETMASTER_API_KEY_HERE&size=20'
    );
    const movies = response.data.results;

    // Clear existing movies and store new ones
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log('Movies fetched and stored in MongoDB');
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Run the fetch on server start
fetchAndStoreMovies();

// API Endpoint to Get Movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movies' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});