const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    _id: String,
    city: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, required: true },
});

module.exports = mongoose.model('Place', placeSchema);