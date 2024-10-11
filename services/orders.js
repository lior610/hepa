const Order = require("../models/orders")
//require the other models for validations
const User = require('../models/users.js');
const Concert = require('../models/concerts.js');
const mongoose = require('mongoose');

//what user action causes order creation?
const createOrder = async (owner, concert, concert_id, tickets_number,
    payment) => {
        const order = new Order({ //new user how did it work? - why not found?
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

const editOrder = async (orderId, owner, concert, concert_id, tickets_number,
    status, date, payment) => {  
    const data = {owner, concert, concert_id, tickets_number,
        status, date, payment}
    return await Order.updateOne({"_id": orderId}, data)
}

const getOrder = async(orderId) => {
    let order = await Order.find({"_id": orderId})
    return order;
}

const getUserOrders = async(owner) => {
    console.log("im in services, the user is ", owner)
    let orders = await Order.find({"owner": owner})
    return orders; //returns an arr of all orders that owname is given user (by full name at the time)
}
const getClosedOrders = async () => {
    let orders = await Order.find({"status": "close"})
    return orders;
} 

//     Validations using the db
// Check if owner exists
async function ownerExists(ownerUsername) {
    return await User.findOne({ 
        "_id": ownerUsername });
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
        return concert && concert.tickets_available >= requestedTickets;
    }
    else return false
}
// Validate date is in the future
async function checkConcertDate(concert_id, date){
    if(mongoose.Types.ObjectId.isValid(concert_id)){
        const concert = await Concert.findOne({ "_id": concert_id });
        const today = new Date();
        const concertDate = today.toISOString().slice(0, 10);
        return (concertDate == date)
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
    checkConcertDate
};