const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    owner: { type: String, required: true },
    concert: { type: String, required: true },
    ticket_number: { type: String, required: true },
    status: { type: String, required: true },    //will it be better to change the field type?
    date: { type: String, required: false }, //if not payd? there is a date?
    payment: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
