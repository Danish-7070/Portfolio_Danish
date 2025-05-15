const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groundSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  prices: {
    type: Array,
    required: true,
  },
  groundType: {
    type: String,
    required: true,
  },
  reserved_times: {
    type: Array,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: "Other",
    enum: ["Rawalpindi", "Islamabad", "Lahore", "Peshawar", "Faisalabad", "Karachi", "Quetta", "Kashmir", "Other"]
  },
  rateWithLights:{
    type: Number,
    default: 0
  },
  rateWithoutLights:{
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ground", groundSchema);

//example post request
// {
//     "name": "ground",
//     "address": "ground address",
//     "phone": "123456789",
//     "prices": [
//         {
//             "duration": 1,
//             "price": 50
//         },
//         {
//             "duration": 2,
//             "price": 100
//         }
//     ],
//     "groundType": "ground type",
//     "reserved_times": [
//         {
//             "date": "2020-04-20",
//             "times": ["10:00", "11:00"]
//         },
//         {
//             "date": "2020-04-21",
//             "times": ["12:00", "13:00"]
//         }
//     ],
//     "startTime": "09:00",
//     "endTime": "18:00"
// }
