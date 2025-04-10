const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://dani:123@cluster0.qmmpkun.mongodb.net/disneyDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model for Disney characters
const characterSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: String,
  image: String,
});

const Character = mongoose.model("Character", characterSchema);

// Fetch data from Disney API and store in MongoDB
const fetchAndStoreData = async () => {
  try {
    const response = await axios.get("https://api.disneyapi.dev/character");
    const data = response.data.data.map((item) => ({
      title: item.name,
      description: item.films?.join(", ") || "No description available",
      rating: item.tvShows?.length.toString() || "N/A",
      image: item.imageUrl,
    }));

    // Clear existing data and insert new data
    await Character.deleteMany({});
    await Character.insertMany(data);
    console.log("Data fetched and stored in MongoDB");
  } catch (error) {
    console.error("Error fetching and storing data:", error);
  }
};

// Run the fetch on server start
fetchAndStoreData();

// API endpoint to get characters
app.get("/api/characters", async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: "Error fetching characters" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));