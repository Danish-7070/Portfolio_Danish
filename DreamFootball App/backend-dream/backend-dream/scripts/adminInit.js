const mongoose = require('mongoose');
const Admin = require('../models/admin');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect("xyz");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create new admin
      const newAdmin = new Admin({
        username: 'admin',
        password: 'admin' // will be hashed by the pre-save hook in the model
      });
      
      await newAdmin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the script
(async () => {
  await connectDB();
  await createAdminUser();
})();
