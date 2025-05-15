const express = require("express");
const router = express.Router();
const { handleUpload } = require("../utils/upload");

const TeamController = require("../controllers/teamController");


router.get("/", TeamController.getTeams);


router.post("/", handleUpload, TeamController.addTeam);
router.put("/:id", handleUpload, TeamController.updateTeam);


router.delete("/:id", TeamController.deleteTeam);


module.exports = router;
