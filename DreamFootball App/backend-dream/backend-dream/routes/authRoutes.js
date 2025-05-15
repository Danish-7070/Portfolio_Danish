const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

// Register routes
router.post("/admin/register", AuthController.registerAdmin);
router.post("/customer/register", AuthController.registerCustomer);
router.post("/team/register", AuthController.registerTeam);

// Login routes
router.post("/admin/login", AuthController.loginAdmin);
router.post("/customer/login", AuthController.loginCustomer);
router.post("/team/login", AuthController.loginTeam);

// Profile routes
router.get("/admin/profile", AuthController.getAdminProfile);
router.get("/customer/profile", AuthController.getCustomerProfile);
router.get("/team/profile", AuthController.getTeamProfile);

// Auth check route
router.get("/check-auth", AuthController.checkAuth);

// Logout route (client-side logout)
router.post("/logout", AuthController.logout);

module.exports = router;