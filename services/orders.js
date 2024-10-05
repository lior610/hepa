const Order = require("../models/orders")

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


module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
    editOrder,
    getOrder,
    getUserOrders,
    getClosedOrders
};