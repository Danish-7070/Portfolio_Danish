const express = require("express");
const router = express.Router();

const teamRequestController = require("../controllers/teamRequestController")

// Route to get all available match requests
router.get('/available-team-requests/:teamId', teamRequestController.getAvailableTeamRequests);

// Route to create a new match request
router.post('/', teamRequestController.createTeamRequest); 

// Route to express interest in a match request (more specific first)
router.patch('/:id/interested/:teamId', teamRequestController.updateInterestStatus);

// Route to express interest in a match request (less specific)
router.patch('/interested/:id', teamRequestController.interestedTeamRequest); 


router.get('/approved/:teamId', teamRequestController.getApprovedRequests); 

// Route to get rejected requests for a specific customer
router.get('/my-team-requests/:teamId', teamRequestController.getMyTeamRequests);

module.exports = router;