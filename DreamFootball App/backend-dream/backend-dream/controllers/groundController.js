const Admin = require("../models/admin");
const Ground = require("../models/ground");

const addGround = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      prices,
      groundType,
      city,
      reserved_times,
      startTime,
      endTime,
      rateWithLights,
      rateWithoutLights
    } = req.body;
    const ground = new Ground({
      name,
      address,
      phone,
      prices,
      groundType,
      city,
      reserved_times,
      startTime,
      endTime,
      rateWithLights: rateWithLights || 0,
      rateWithoutLights: rateWithoutLights || 0
    });
    await ground.save();
    return res.status(201).json({ message: "Ground added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find();
    return res.status(200).json({ grounds });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getGround = async (req, res) => {
  try {
    const { id } = req.params;
    const ground = await Ground.findById(id);
    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }
    return res.status(200).json({ ground });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateGround = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      phone,
      prices,
      groundType,
      city,
      reserved_times,
      startTime,
      endTime,
      rateWithLights,
      rateWithoutLights
    } = req.body;
    const ground = await Ground.findById(id);
    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }
    ground.name = name;
    ground.address = address;
    ground.phone = phone;
    ground.prices = prices;
    ground.groundType = groundType;
    ground.city=city;
    ground.reserved_times = reserved_times;
    ground.startTime = startTime;
    ground.endTime = endTime;
    ground.rateWithLights = rateWithLights || 0;
    ground.rateWithoutLights = rateWithoutLights || 0;
    await ground.save();
    return res.status(200).json({ message: "Ground updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteGround = async (req, res) => {
  try {
    const { id } = req.params;
    const ground = await Ground.findByIdAndDelete(id);
    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }
    
    return res.status(200).json({ message: "Ground deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGround,
  getGrounds,
  getGround,
  updateGround,
  deleteGround,
};
