const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: String,
  title: String,
  company: String,
  location: String,
  description: String,
  requirements: String,
  applicationLink: String,
});

module.exports = mongoose.model('Job', jobSchema);