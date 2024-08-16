const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    full_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    mail: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        number: { type: Number, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true }
    },
    gender: { type: String, required: true },
    kind: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
