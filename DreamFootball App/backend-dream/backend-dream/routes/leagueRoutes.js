const express = require("express");
const router = express.Router();

const LeagueController = require("../controllers/leagueController");
const { handleUpload } = require("../utils/upload");

router.get("/", LeagueController.getLeagues);
router.get("/:id", LeagueController.getLeague);
router.post("/",handleUpload, LeagueController.addLeague);
router.put("/:id",handleUpload, LeagueController.updateLeague);
router.delete("/:id", LeagueController.deleteLeague);

module.exports = router;
