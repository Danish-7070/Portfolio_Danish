const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const cors = require("cors");

const verifyAdmin = require("./middleware/verifyAdmin");
const verifyCustomer = require("./middleware/verifyCustomer");

const authRoutes = require("./routes/authRoutes");
const groundRoutes = require("./routes/groundRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emailRoutes = require("./routes/emailRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const generalRoutes = require("./routes/generalRoutes");
const challengeRoutes = require("./routes/challengesRoutes");
const teamRoutes = require("./routes/teamRoutes");
const leagueRoutes = require("./routes/leagueRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const matchRequestRoutes = require("./routes/matchRequestRoutes");
const newsBoxRoutes = require("./routes/newsBoxRoutes");
const teamRequestRoutes = require("./routes/teamRequestRoutes");

const customerTeamController = require("./controllers/customerTeamController"); 
const teamController = require("./controllers/teamController"); 
const leagueController = require("./controllers/leagueController");
const bookingController = require("./controllers/bookingController");
const groundController = require("./controllers/groundController");
const reviewsController = require("./controllers/reviewsController");
const playerRoutes = require("./routes/playerRoutes");


dotenv.config();

const app = express();

app.use(cors(
  {
    origin: ["https://dream-total.com","https://football-project-client.vercel.app","http://localhost:5173"],
  }
));

app.use(express.json({ limit: '50mb' }));

//Middleware
app.use((req, res, next) => {
  console.log(req.method, req.hostname, req.path);
  next();
})


app.get("/teams/statistics",teamController.getTeamsStatistics);
app.use("/news", newsBoxRoutes);
app.use("/all-grounds", groundController.getGrounds);

app.get("/teams/bookings", bookingController.getBookings);
app.post("/teams/bookings", bookingController.addBooking);

app.get("/all-reviews", reviewsController.getReviews);

// leagues 
app.get("/teams/leagues", leagueController.getLeagues);
app.get("/teams/leagues/:id", leagueController.getLeague);

app.get("/teams/grounds", groundController.getGrounds);


// team auth
app.post("/customer/teams/register", customerTeamController.registerTeam);
app.post("/customer/teams/login", customerTeamController.loginTeam);

// other routes
app.get("/customer/teams/",customerTeamController.getTeamsForCustomer);
app.get("/customer/teams/team-profile", customerTeamController.getTeamProfile);
app.get("/bookings", bookingController.getBookings);

// match reqest routes
app.use("/customer/match-requests", verifyCustomer.verifyCustomer, matchRequestRoutes);

app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/grounds", verifyAdmin.verifyAdmin, groundRoutes);
app.use("/teams", verifyAdmin.verifyAdmin, teamRoutes);
app.use("/leagues", verifyAdmin.verifyAdmin, leagueRoutes);
app.use("/bookings", verifyAdmin.verifyAdmin, bookingRoutes);
app.use("/admin", verifyAdmin.verifyAdmin, adminRoutes);
app.use("/email", emailRoutes);
app.use("/customer", verifyCustomer.verifyCustomer, customerRoutes);
app.use("/reviews", verifyCustomer.verifyCustomer, reviewsRoutes);
app.use("/general", generalRoutes);
// app.use("/admin/challenge", verifyAdmin.verifyAdmin, challengeRoutes);
app.use("/challenge", challengeRoutes);
app.use("/team-requests", teamRequestRoutes);

app.use("/players", playerRoutes);






app.get("/", (req, res) => {
  res.send("Welcome to the Ground Booking API");
});

const PORT = process.env.PORT || 5000;
const dbUrl = process.env.MONGO_URI;

mongoose
  .connect(dbUrl)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connected successfully");
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
