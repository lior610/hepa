const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const concertSchema = new Schema({
    artist_name: { type: String, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    door_opening: { type: String, required: true },
    location: { type: String, required: true },
    ticket_amount: { type: Number, required: true },
    tickets_available: { type: Number, required: true },
    picture: { type: Buffer, required: true } // Storing image as binary data (Buffer)
});

module.exports = mongoose.model('Concert', concertSchema);