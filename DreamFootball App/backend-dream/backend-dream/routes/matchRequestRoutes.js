const express = require("express");
const matchRequestController = require("../controllers/matchRequestController");
const router = express.Router();

// Route to get all available match requests
router.get('/available-match-requests', matchRequestController.getAvailableMatchRequests);

// Route to create a new match request
router.post('/', matchRequestController.createMatchRequest); 

// Route to express interest in a match request (more specific first)
router.patch('/:id/interested/:playerId', matchRequestController.updateInterestStatus);

// Route to express interest in a match request (less specific)
router.patch('/interested/:id', matchRequestController.interestedMatchRequest); 


// Route to reject a match request
// router.patch('/reject/:id', matchRequestController.rejectMatchRequest); 

// Route to get approved requests for a specific customer
router.get('/approved/:customerId', matchRequestController.getApprovedRequests); 

// Route to get rejected requests for a specific customer
router.get('/my-matches/:customerId', matchRequestController.getMyMatches);
module.exports = router;
