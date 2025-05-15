//newsBox model with timestamps true
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsBoxSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("NewsBox", newsBoxSchema);