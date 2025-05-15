const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/customers", adminController.getCustomers);
router.get("/statistics", adminController.getStatistics);
router.put("/customer/:id", adminController.setCustomerStatus);
router.get("/emails", adminController.getEmails);
router.post("/emails", adminController.addEmail);
router.get("/users", adminController.getUsers);
router.put("/block-user/:id", adminController.blockUser);
router.put("/ground/reserved/:id", adminController.addReservedTime);

// Financial reporting routes
router.get("/financial-report", adminController.getFinancialReport);
router.get("/financial-report/grounds", adminController.getGroundsForReport);


module.exports = router;