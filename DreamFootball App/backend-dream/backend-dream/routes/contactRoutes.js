const express = require("express");
const router = express.Router();

const verifyCustomer = require("../middleware/verifyCustomer");
const verifyAdmin = require("../middleware/verifyAdmin");

const contactController = require("../controllers/contactController");


router.get("/",verifyAdmin.verifyAdmin, contactController.getContactForms);
router.post("/",verifyCustomer.verifyCustomer, contactController.postContactForm);

module.exports = router;
