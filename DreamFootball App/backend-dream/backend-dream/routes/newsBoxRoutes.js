const express = require("express");
const router = express.Router();

const newsBoxController = require("../controllers/newsBoxController");

router.get("/", newsBoxController.getNews);
router.post("/", newsBoxController.addNews);
router.put("/:id", newsBoxController.updateNews);
router.delete("/:id", newsBoxController.deleteNews);

module.exports = router;