const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const concertSchema = new Schema({
    id: { type: Number, required: true },
    artist_name: { type: String, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    door_opening: { type: String, required: true },
    location: { type: String, required: true },
    ticket_amount: { type: Number, required: true },
    picture: { type: Buffer, required: true }
});

module.exports = mongoose.model('Concert', concertSchema);
