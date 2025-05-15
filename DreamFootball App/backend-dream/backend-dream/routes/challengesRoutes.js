const express = require("express");
const router = express.Router();

const challengesController = require("../controllers/challengesController");

router.get("/active", challengesController.getChallengesForTeam);
router.patch("/accept/:id", challengesController.acceptChallenge);
router.patch("/reject/:id", challengesController.rejectChallenge);
router.get("/", challengesController.getChallenges);
router.get("/:id", challengesController.getChallenge);
router.post("/", challengesController.addChallenge);
router.put("/:id", challengesController.changeChallengeStatus);
router.delete("/:id", challengesController.deleteChallenge);
module.exports = router;
