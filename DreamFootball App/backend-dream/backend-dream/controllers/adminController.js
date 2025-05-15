const Customer = require("../models/customer");
const Email = require("../models/email");
const Ground = require("../models/ground");
const League = require("../models/league");
const Review = require("../models/reviews");
const Booking = require("../models/booking");
const Team = require("../models/team");

module.exports = {
  //get all customers
  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).json({ customers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  //set status of a customer to blocked or active
  setCustomerStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      customer.status = customer.status === "active" ? "blocked" : "active";
      await customer.save();
      return res
        .status(200)
        .json({ message: "Customer status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  //get all emails
  getEmails: async (req, res) => {
    try {
      let emails = await Email.find();
      //also get email of all customers
      const customers = await Customer.find();

      const formattedEmails = emails.map((email) => ({
        email: email.email,
        createdAt: email.createdAt
      }));


      customers.forEach((customer) => {
        formattedEmails.push({
          email: customer.email,
          createdAt: customer.createdAt
        });
      });

      res.status(200).json(formattedEmails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //add an email
  addEmail: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const newEmail = new Email({ email });
      await newEmail.save();
      return res.status(201).json({ message: "Email added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //get all users
  getUsers: async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).json({ customers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Block a user
  blockUser: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Toggle the status
      customer.status = customer.status === "active" ? "blocked" : "active";
      await customer.save();

      return res.status(200).json({ message: `Customer ${customer.status} successfully` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },


  //add to reserved times of a ground
  addReservedTime: async (req, res) => {
    try {
      const { id } = req.params;
      const { reserved_time } = req.body;
      //reserved time will be sent in an object with date and start time and end time
      const date = reserved_time.date;
      const start_time = reserved_time.start_time;
      const end_time = reserved_time.end_time;

      const ground = await Ground.findById(id);
      if (!ground) {
        return res.status(404).json({ message: "Ground not found" });
      }

      //push in an object form {date,[start_time,end_time]}
      ground.reserved_times.push({
        date,
        time: [start_time, end_time],
      });
      await ground.save();
      return res
        .status(200)
        .json({ message: "Reserved time added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  //get statistics
  getStatistics: async (req, res) => {
    try {
      // Fetch counts from the database
        const customerCount = await Customer.countDocuments({});
        const emailCount = await Email.countDocuments({});
        const groundCount = await Ground.countDocuments({});
        const leagueCount = await League.countDocuments({});
        const confirmedBookingsCount = await Booking.countDocuments({ bookingStatus: 'confirmed' });
        const completedBookingsCount = await Booking.countDocuments({ bookingStatus: 'completed' });
        const teamCount = await Team.countDocuments({});
    
      // Calculate the average rating
      const reviews = await Review.find();
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;

      const statistics = {
        totalNumberOfUsers: customerCount,
        totalNumberOfEmails: emailCount,
        totalNumberOfGrounds: groundCount,
        totalNumberOfLeagues: leagueCount,
        totalNumberOfConfirmedBookings: confirmedBookingsCount,
        totalNumberOfCompletedBookings: completedBookingsCount,
        totalNumberOfTeams: teamCount,
        averageRating, // Include the average rating
      };

      res.status(200).json(statistics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Financial Report Functions
  // Get financial report data
// Get financial report data
getFinancialReport: async (req, res) => {
  try {
    const { groundId, month, year } = req.query;
    
    if (!groundId) {
      return res.status(400).json({ message: "Ground ID is required" });
    }

    // Check if multiple grounds are requested (comma-separated IDs)
    const groundIds = groundId.includes(',') ? groundId.split(',') : [groundId];
    
    // Parse month and year to integers
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    if (isNaN(monthInt) || isNaN(yearInt)) {
      return res.status(400).json({ message: "Invalid month or year format" });
    }

    // For multiple grounds, process each one
    if (groundIds.length > 1) {
      const reportPromises = groundIds.map(id => 
        generateReportForGround(id, monthInt, yearInt)
      );
      
      const groundReports = await Promise.all(reportPromises);
      
      // Combine all reports into a single report
      const combinedReport = combineReports(groundReports);
      
      return res.status(200).json(combinedReport);
    } else {
      // Single ground report
      const singleGroundReport = await generateReportForGround(groundIds[0], monthInt, yearInt);
      
      return res.status(200).json(singleGroundReport);
    }
  } catch (error) {
    console.error("Error getting financial report:", error);
    return res.status(500).json({ message: error.message });
  }
},


getGroundsForReport: async (req, res) => {
  try {
    // Get all grounds with necessary fields for reporting
    const grounds = await Ground.find({}, {
      _id: 1,
      name: 1,
      city: 1,
      rateWithLights: 1,
      rateWithoutLights: 1
    }).sort({ name: 1 });
    
    return res.status(200).json(grounds);
  } catch (error) {
    console.error("Error getting grounds for report:", error);
    return res.status(500).json({ message: error.message });
  }
},
};

//example push to reserved times
// {
//   "reserved_time": {
//     "date": "2021-07-20",
//     "start_time": "10:00",
//     "end_time": "12:00"
//   }

// Helper function to generate a report for a single ground
async function generateReportForGround(groundId, monthInt, yearInt) {
  // Validate if ground exists
  const ground = await Ground.findById(groundId);
  if (!ground) {
    throw new Error(`Ground with ID ${groundId} not found`);
  }

  // Calculate start and end dates for the specified month and year
  const startDate = new Date(yearInt, monthInt, 1);
  const endDate = new Date(yearInt, monthInt + 1, 0, 23, 59, 59, 999); // Last day of month

  // Query bookings for the specified ground, month, and year
  const bookings = await Booking.find({
    ground: groundId,
    bookingDate: { $gte: startDate, $lte: endDate },
    bookingStatus: { $in: ["confirmed", "completed"] } // Only consider confirmed or completed bookings
  }).sort({ bookingDate: 1 });

  // Initialize report data
  let totalRevenue = 0;
  let totalBookings = bookings.length;
  let totalHours = 0;
  let bookingsWithLights = 0;
  let bookingsWithoutLights = 0;
  
  // Map to store daily data
  const dailyDataMap = new Map();
  
  // Process each booking
  bookings.forEach(booking => {
    // Calculate totals
    totalRevenue += booking.bookingPrice;
    totalHours += booking.bookingDuration;
    
    // Count bookings with/without lights
    if (booking.withLights) {
      bookingsWithLights++;
    } else {
      bookingsWithoutLights++;
    }
    
    // Process daily data
    const bookingDate = new Date(booking.bookingDate);
    const dateKey = bookingDate.toISOString().split('T')[0];
    
    if (!dailyDataMap.has(dateKey)) {
      dailyDataMap.set(dateKey, {
        date: bookingDate,
        bookings: 0,
        revenue: 0,
        hours: 0
      });
    }
    
    const dailyData = dailyDataMap.get(dateKey);
    dailyData.bookings++;
    dailyData.revenue += booking.bookingPrice;
    dailyData.hours += booking.bookingDuration;
  });
  
  // Convert daily data map to array and sort by date
  const dailyData = Array.from(dailyDataMap.values()).sort((a, b) => a.date - b.date);
  
  // Return the report data
  return {
    groundId,
    groundName: ground.name,
    totalRevenue,
    totalBookings,
    totalHours,
    bookingsWithLights,
    bookingsWithoutLights,
    dailyData
  };
}

// Helper function to combine multiple ground reports
function combineReports(reports) {
  if (!reports || reports.length === 0) {
    return {
      totalRevenue: 0,
      totalBookings: 0,
      totalHours: 0,
      bookingsWithLights: 0,
      bookingsWithoutLights: 0,
      dailyData: []
    };
  }
  
  // Initialize combined report
  const combinedReport = {
    totalRevenue: 0,
    totalBookings: 0,
    totalHours: 0,
    bookingsWithLights: 0,
    bookingsWithoutLights: 0,
    dailyData: [],
    includedGrounds: []
  };
  
  // Map to merge daily data by date
  const dailyDataMap = new Map();
  
  // Process each report
  reports.forEach(report => {
    // Add ground to the included list
    if (report.groundId && report.groundName) {
      combinedReport.includedGrounds.push({
        id: report.groundId,
        name: report.groundName
      });
    }
    
    // Add totals
    combinedReport.totalRevenue += report.totalRevenue || 0;
    combinedReport.totalBookings += report.totalBookings || 0;
    combinedReport.totalHours += report.totalHours || 0;
    combinedReport.bookingsWithLights += report.bookingsWithLights || 0;
    combinedReport.bookingsWithoutLights += report.bookingsWithoutLights || 0;
    
    // Merge daily data
    if (report.dailyData && report.dailyData.length > 0) {
      report.dailyData.forEach(dayData => {
        const dateKey = new Date(dayData.date).toISOString().split('T')[0];
        
        if (!dailyDataMap.has(dateKey)) {
          dailyDataMap.set(dateKey, {
            date: new Date(dayData.date),
            bookings: 0,
            revenue: 0,
            hours: 0
          });
        }
        
        const existingData = dailyDataMap.get(dateKey);
        existingData.bookings += dayData.bookings || 0;
        existingData.revenue += dayData.revenue || 0;
        existingData.hours += dayData.hours || 0;
      });
    }
  });
  
  // Convert daily data map to array and sort by date
  combinedReport.dailyData = Array.from(dailyDataMap.values()).sort((a, b) => a.date - b.date);
  
  return combinedReport;
}