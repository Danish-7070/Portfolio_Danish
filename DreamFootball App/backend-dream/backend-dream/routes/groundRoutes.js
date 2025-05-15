const express = require("express");
const router = express.Router();

const GroundController = require("../controllers/groundController");

router.get("/", GroundController.getGrounds);
router.post("/", GroundController.addGround);
router.get("/:id", GroundController.getGround);
router.put("/:id", GroundController.updateGround);
router.delete("/:id", GroundController.deleteGround);

module.exports = router;
