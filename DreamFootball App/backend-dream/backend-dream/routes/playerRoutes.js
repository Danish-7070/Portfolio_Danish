const express = require("express");
const router = express.Router();

const PlayerController = require("../controllers/playerController");

router.get("/statistics", PlayerController.getPlayersStatistics);

module.exports = router;
