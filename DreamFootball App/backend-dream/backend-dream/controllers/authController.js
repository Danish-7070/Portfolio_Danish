const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Admin = require("../models/admin");
const Customer = require("../models/customer");
const Email = require("../models/email");
const Team = require("../models/team");

module.exports = {
  // Admin authentication
  registerAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      // Check if admin already exists
      const admin = await Admin.findOne({ username });
      if (admin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      // Create new admin
      const newAdmin = new Admin({
        username,
        password,
      });
      await newAdmin.save();
      return res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({
        username,
      });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ token, adminToken: token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Customer authentication
  registerCustomer: async (req, res) => {
    try {
      const { username, password, email, address, phone, dob, name } = req.body;
      // Check if customer already exists
      const customer = await Customer.findOne({ email });
      if (customer) {
        return res.status(400).json({ message: "Customer already exists" });
      }
      
      const customer2 = await Customer.findOne({username});
      if(customer2){
        return res.status(400).json({ message: "Username already exists" });
      }

      const customer3 = await Customer.findOne({ phone });
      if(customer3){
        return res.status(400).json({ message: "Phone already registered" });
      }

      // Create new customer
      const newCustomer = new Customer({
        username,
        name,
        password,
        email,
        address,
        phone,
        dob,
      });
      await newCustomer.save();
      const newEmail = new Email({ email });
      await newEmail.save();
      return res.status(201).json({ message: "Customer created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  loginCustomer: async (req, res) => {
    try {
      const { email, password } = req.body;
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(404).json({ message: "Account not found" });
      }
      if (customer.status === "blocked") {
        return res.status(400).json({ message: "Customer is blocked" });
      }
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = jwt.sign({ id: customer._id, role: "customer" }, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Team authentication
  registerTeam: async (req, res) => {
    try {
      const { teamName, password, email, city } = req.body;
      
      // Check if team already exists
      const teamExists = await Team.findOne({ teamName });
      if (teamExists) {
        return res.status(400).json({ message: "Team already exists" });
      }

      const emailExists = await Team.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create new team
      const hashedPassword = await bcrypt.hash(password, 10);
      const team = new Team({ 
        teamName, 
        password: hashedPassword, 
        email, 
        city: city || "Other",
        players: []
      });
      
      await team.save();
      return res.status(201).json({ message: "Team registered successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  loginTeam: async (req, res) => {
    try {
      const { email, password } = req.body;
      const team = await Team.findOne({ email });
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      const isMatch = await bcrypt.compare(password, team.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      
      const teamToken = jwt.sign({ id: team._id, role: "team" }, process.env.JWT_SECRET);
      return res.status(200).json({ teamToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Profile endpoints
  getAdminProfile: async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Authentication token is required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select("-password");
      
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      
      return res.status(200).json({ admin });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  getCustomerProfile: async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Authentication token is required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const customer = await Customer.findById(decoded.id).select("-password");
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      if (customer.status === "blocked") {
        return res.status(403).json({ message: "Your account has been blocked" });
      }
      
      return res.status(200).json({ customer });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  getTeamProfile: async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Authentication token is required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const team = await Team.findById(decoded.id).populate("players").select("-password");
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      return res.status(200).json({ team });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Auth check endpoint
  checkAuth: async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(200).json({ isAuthenticated: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === "admin") {
        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(200).json({ isAuthenticated: false });
        return res.status(200).json({ isAuthenticated: true, role: "admin" });
      } 
      else if (decoded.role === "customer") {
        const customer = await Customer.findById(decoded.id);
        if (!customer) return res.status(200).json({ isAuthenticated: false });
        if (customer.status === "blocked") return res.status(200).json({ isAuthenticated: false });
        return res.status(200).json({ isAuthenticated: true, role: "customer" });
      }
      else if (decoded.role === "team") {
        const team = await Team.findById(decoded.id);
        if (!team) return res.status(200).json({ isAuthenticated: false });
        return res.status(200).json({ isAuthenticated: true, role: "team" });
      }
      
      return res.status(200).json({ isAuthenticated: false });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ isAuthenticated: false });
    }
  },
  
  // Logout endpoint (client-side only)
  logout: async (req, res) => {
    // Just a placeholder since logout is handled client-side
    return res.status(200).json({ message: "Logged out successfully" });
  }
};