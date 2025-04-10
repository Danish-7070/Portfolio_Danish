const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const seedRestaurants = [
  {
    name: 'Burger King',
    cuisine: 'Burger',
    rating: '4.5',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  },
  {
    name: 'Pizza Hut',
    cuisine: 'Pizza',
    rating: '4.2',
    image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
  },
  {
    name: 'Subway',
    cuisine: 'Sandwich',
    rating: '4.0',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  },
  {
    name: 'KFC',
    cuisine: 'Fried Chicken',
    rating: '4.3',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  await Restaurant.deleteMany(); // Clear existing data
  await Restaurant.insertMany(seedRestaurants); // Insert seed data
  console.log('Database seeded successfully');
  mongoose.connection.close();
})
.catch((err) => {
  console.error('Error:', err);
  mongoose.connection.close();
});