const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://dani:123@cluster0.7uy1dr0.mongodb.net/ecommerce?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  discount: { type: Number, default: 20 }, // Adding discount field
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// Seed initial data (run once or as needed)
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const initialProducts = [
        {
          title: "Wireless Headphones",
          price: 59.99,
          image: "https://example.com/headphones1.jpg",
          description: "High-quality wireless headphones with noise cancellation",
          category: "Electronics"
        },
        {
          title: "Bluetooth Earbuds",
          price: 39.99,
          image: "https://example.com/earbuds1.jpg",
          description: "Compact wireless earbuds with long battery life",
          category: "Electronics"
        }
      ];
      await Product.insertMany(initialProducts);
      console.log('Initial products seeded');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Start server and seed data
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  seedProducts();
});