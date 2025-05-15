const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    by: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Review', reviewSchema);

//example post request
// {
//     "title": "review title",
//     "description": "review description",
//     "rating": 5
// }