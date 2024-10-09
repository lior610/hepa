const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    owner: { type: String, required: true },
    concert: { type: String, required: true },
    concert_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'concerts.js', // ref to Concert model
        required: true,
      },
    tickets_number: { type: Number, required: true },
    status: {
        type: String,
        enum: ['open', 'close'], // Adjust based on requirements
        required: true,
      },  
    date: { type: String, required: false }, //if not payd? there is a date?
    payment: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
