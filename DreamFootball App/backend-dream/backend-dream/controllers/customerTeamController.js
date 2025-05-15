const Team = require("../models/team");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

module.exports = {
    getTeamsForCustomer: async (req, res) => {
        try {
            console.log("Request entered for getTeamsForCustomer");
            const teams = await Team.find().populate("players").select("-password");
            res.status(200).json({ teams });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //register team
    registerTeam: async (req, res) => {
        try {
            const { teamName, players, email } = req.body;
            const password = await bcrypt.hash(req.body.password, 10);

            const team = new Team({ teamName, players, password, email });
            //if team already exists
            const teamExists = await Team.findOne({ teamName });
            if (teamExists) {
                return res.status(400).json({ message: "Team already exists" });
            }

            const emailExists = await Team.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already exists" });
            }

            await team.save();
            res.status(201).json({ message: "Team added successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //login team
    loginTeam: async (req, res) => {
        try {
            const { email, password } = req.body;
            const team = await Team.findOne({
                email,
            });
            if (!team) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
            const validPassword = await bcrypt.compare(password, team.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
            const teamToken = jwt.sign({ id: team._id }, process.env.JWT_SECRET);
            res.status(200).json({ teamToken });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTeamProfile: async (req, res) => {
        try {
            // Extract token from headers
            console.log('req : ', req);
            const teamToken = req.headers.authorization;
            console.log("hello : ", teamToken);
            if (!teamToken) {
                return res.status(401).json({ message: "Token is required" });
            }

            // Verify and decode the token
            const decoded = jwt.verify(teamToken, process.env.JWT_SECRET);
            const id = decoded.id;

            const team = await Team.findById(id);
            if (!team) {
                return res.status(404).json({ message: "Team not found" });
            }
            res.status(200).json({ team });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}