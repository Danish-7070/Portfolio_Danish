const express = require("express");
const router = express.Router();

const generalController = require("../controllers/generalController");

router.get("/reviews", generalController.getReviews);
router.get("/challenges", generalController.getActiveChallenges);
router.get("/grounds", generalController.getGrounds);

module.exports = router;