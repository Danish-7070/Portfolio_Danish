const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Email', emailSchema);

//example post request
// {
//     "email": "email"
// }