import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./home/page";
import Login from "./auth/login";
import Register from "./customer/register";
import LoginCustomer from "./customer/customerlogin";
import Ground from "./dashboard/ground/ground";
import Booking from "./dashboard/booking/booking";
import CustomerBooking from "./customer/customerBooking";
import Users from "./dashboard/users/users";
import Emails from "./dashboard/emails/emails";
import Teams from "./dashboard/teams/teams";
import MainDashboard from "./dashboard/statistics/stats";
import LeaveReview from "./home/leavereview";
import Challenges from "./dashboard/challenges/challenges";
import ContactUs from "./home/contact-us/ContactUs";
import AdminLeagues from "./dashboard/leagues/adminLeagues";
import CustomerLeagues from "./customer/leagues/customerLeagues";
import LeagueDetails from "./customer/leagues/leagueDetails";
import { Toaster } from "react-hot-toast";
import AdminLeagueDetails from "./dashboard/leagues/AdminLeagueDetails";
import CustomerTeams from "./customer/teams/customerTeams";
import TeamLogin from "./customer/teams/teamAuth/teamLogin";
import TeamRegister from "./customer/teams/teamAuth/teamRegister";
import TeamsBooking from "./customer/teams/teamBooking";
import CustomerMatchRequests from "./customer/matchRequests/customerMatchRequests";
import NewsAdmin from "./dashboard/News/NewsAdmin";
import ContactFormsAdmin from "./home/contact-forms/ContactFormsAdmin";
import DreamInvestment from "./invest/page";
import PlayerProfiles from "./components/playerProfile/PlayerProfiles";
import AdminFinancialReport from "./components/report/AdminFinancialReport";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/player-profiles" element={<PlayerProfiles />} />
          <Route path="/invest" element={<DreamInvestment />} />

          {/* Public Routes with Redirect for Authenticated Users */}
          <Route element={<PublicRoute />}>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/customer/login" element={<LoginCustomer />} />
            <Route path="/customer/register" element={<Register />} />
            <Route path="/teams/login" element={<TeamLogin />} />
            <Route path="/teams/register" element={<TeamRegister />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<MainDashboard />} />
            <Route path="/admin/dashboard/ground" element={<Ground />} />
            <Route path="/admin/dashboard/booking" element={<Booking />} />
            <Route path="/admin/dashboard/users" element={<Users />} />
            <Route path="/admin/dashboard/newsletter-subscriptions" element={<Emails />} />
            <Route path="/admin/dashboard/contact-forms" element={<ContactFormsAdmin />} />
            <Route path="/admin/dashboard/teams" element={<Teams />} />
            <Route path="/admin/dashboard/challenges" element={<Challenges />} />
            <Route path="/admin/dashboard/leagues" element={<AdminLeagues />} />
            <Route path="/admin/dashboard/news" element={<NewsAdmin />} />
            <Route path="/admin/dashboard/leagues/:id" element={<AdminLeagueDetails />} />
            <Route path="/admin/dashboard/financial-report" element={<AdminFinancialReport />} />
          </Route>

          {/* Customer Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="customer" />}>
            <Route path="/customer/booking" element={<CustomerBooking />} />
            <Route path="/customer/match-requests" element={<CustomerMatchRequests />} />
          </Route>
          
            <Route path="/customer/leagues" element={<CustomerLeagues />} />
            <Route path="/customer/leagues/:id" element={<LeagueDetails />} />

          {/* Team Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="team" />}>
            <Route path="/teams/booking" element={<TeamsBooking />} />
            <Route path="/teams" element={<CustomerTeams />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;