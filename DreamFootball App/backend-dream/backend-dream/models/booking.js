const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: false,
    },
    customerName:{
        type: String,
        required: false,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    bookingTime: {
        type: String,
        required: true,
    },
    bookingDuration: {
        type: Number,
        required: true,
    },
    bookingPrice: {
        type: Number,
        required: true,
    },
    bookingStatus: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: false,
    },
    ground: {
        type: Schema.Types.ObjectId,
        ref: 'Ground',
        required: true,
    },
    stillRequiredPlayers: {
        type: Number,
        required: false,
    },
    teamRequired:{
        type: Boolean,
        default: false,
    },
    withLights:{
        type: Boolean,
        default: false
    },
    tid:{ //transaction id
        type: String
    },
    phone:{
        type: String,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);