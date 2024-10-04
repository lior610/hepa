const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//require the other models for validations
const User = require('./users.js');
const Concert = require('./concerts.js');

const orderSchema = new Schema({
    owner: { type: String, required: true },
    concert: { type: String, required: true },
    ticket_number: { type: String, required: true },
    status: { type: String, required: true },    //will it be better to change the field type?
    date: { type: String, required: false }, //if not payd? there is a date?
    payment: { type: String, required: true }
});

//     Validations using the db
// Check if owner exists
async function ownerExists(ownerName) {
    return await User.findOne({ 
        full_name: ownerName });
}
// Check if concert exists
async function concertExists(concertName) {
    return await Concert.findOne({ 
        artist_name: concertName });
}
// Check if enough tickets are available
async function checkTicketAvailability(concertName, requestedTickets) {
    const concert = await Concert.findOne({ artist_name: concertName });
    return concert && concert.tickets_available >= requestedTickets;
}

module.exports = mongoose.model('Order', orderSchema);
module.exports = {
    ownerExists,
    concertExists,
    checkTicketAvailability
};
