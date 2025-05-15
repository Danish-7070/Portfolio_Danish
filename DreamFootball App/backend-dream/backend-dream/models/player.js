const mongoose = require('mongoose');
const Team = require('./team');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
});

module.exports = mongoose.model('Player', playerSchema);