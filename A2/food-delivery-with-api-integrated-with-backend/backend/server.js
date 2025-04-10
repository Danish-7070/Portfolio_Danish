const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://dani:123@cluster0.cmczrct.mongodb.net/foodDelivery?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  rating: String,
  image: String,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// API Endpoint to Get Restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
});

// Seed initial data (optional, run once)
const seedData = async () => {
  const initialRestaurants = [
    { name: 'Burger King', cuisine: 'Burger', rating: '4.5', image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg' },
    { name: 'Pizza Hut', cuisine: 'Pizza', rating: '4.2', image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg' },
    { name: 'Subway', cuisine: 'Sandwich', rating: '4.0', image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg' },
    { name: 'KFC', cuisine: 'Fried Chicken', rating: '4.3', image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg' },
  ];

  await Restaurant.deleteMany(); // Clear existing data
  await Restaurant.insertMany(initialRestaurants);
  console.log('Initial data seeded');
};

// Uncomment the line below to seed data on first run
// seedData();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});