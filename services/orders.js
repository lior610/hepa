const Order = require("../models/orders")
const User = require('../models/users.js');
const Concert = require('../models/concerts.js');
const mongoose = require('mongoose');

const createOrder = async (owner, concert, concert_id, tickets_number,
    payment,) => {
        const order = new Order({
            owner, concert, concert_id, tickets_number, payment
        });
        order.status = "open"
        order.date = "";
        return await order.save();
}

const getOrders = async () => {
    let orders = await Order.find({})
    return orders;
} 

const deleteOrder = async (orderId) => {
    return await Order.deleteOne({"_id": orderId});
}


// Update all orders for a specific concert ID to canceled
const cancelOrdersForConcert = async (concertId) => {
    try {
        const result = await Order.updateMany(
            { concert_id: concertId }, 
            { $set: { status: "canceled" } }
        );
        return result;
    } catch (error) {
        throw new Error(`Error updating orders: ${error.message}`);
    }
};

const editOrder = async (orderId, owner, concert, concert_id, tickets_number,
    status, payment) => {  
    //change the date to be today, edit day
    const today = new Date();
    const date = today.toISOString().slice(0, 10);

    const data = {owner, concert, concert_id, tickets_number,
        status, date, payment}
    return await Order.updateOne({"_id": orderId}, data)
}

const getOrder = async(orderId) => {
    let order = await Order.find({"_id": orderId})
    return order;
}

const getUserOrders = async(owner) => {
    let orders = await Order.find({"owner": owner})
    return orders;
}
const getClosedOrders = async () => {
    let orders = await Order.find({"status": "close"})
    return orders;
} 

//     Validations using the db
// Check if owner exists
async function ownerExists(ownerUsername) {
    const user = await User.findOne({ 
        "_id": ownerUsername });
        return user
}
// Check if concert exists
async function concertExists(concert_artist, concert_id) {
    if(mongoose.Types.ObjectId.isValid(concert_id)){
        const concert_object = await Concert.findOne({ 
            "_id": concert_id });
        return (concert_object.artist_name == concert_artist)
    }
    else return false
    
}
// Check if enough tickets are available
async function checkTicketAvailability(concert_id, requestedTickets) {
    if(mongoose.Types.ObjectId.isValid(concert_id)){
        const concert = await Concert.findOne({ "_id": concert_id });
        return concert && (concert.tickets_available >= requestedTickets);
    }
    else return false
}
// Validate date is in the future
async function checkConcertDate(concert_id){
    if(mongoose.Types.ObjectId.isValid(concert_id)){
        const concert = await Concert.findOne({ "_id": concert_id });
        concertDate = new Date(concert.date)
        let today = new Date()
        today.setHours(0, 0, 0, 0);
        return (concertDate > today )  
    }
    else return false
}

module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
    editOrder,
    getOrder,
    getUserOrders,
    getClosedOrders,
    ownerExists,
    concertExists,
    checkTicketAvailability,
    checkConcertDate,
    cancelOrdersForConcert
};