const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const customerSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name:{
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "active",
  },
  leftReview: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

customerSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

customerSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("Customer", customerSchema);

//example post request
// {
//     "username": "customer",
//     "password": "customer",
//     "email": "customer@gmail.com",
//     "address": "customer address",
//     "phone": "+1234567890",
//     "dob": "1990-01-01",
//     "team": "customer team"
// }
