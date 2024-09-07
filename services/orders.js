const Order = require("../models/orders")

//what user action causes order creation?
const createOrder = async (owner, concert, ticket_number,
    date, payment) => {
        const order = new Order({ //new user how did it work? - why not found?
            owner, concert, ticket_number,
            date, payment
        });
        order.status = "open"

        return await order.save();
}

const getOrders = async () => {
    let orders = await Order.find({})
    return orders;
} 

const deleteOrder = async (orderId) => {
    return await Order.deleteOne({"_id": orderId});
}

const editOrder = async (orderId, owner, concert, ticket_number,
    status, date, payment) => {  ///will it work when paying?
    const data = {owner, concert, ticket_number,
        status, date, payment}
    return await Order.updateOne({"_id": orderId}, data)
}

const getOrder = async(orderId) => {
    let orders = await Order.find({"_id": orderId})
    return orders;
}

module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
    editOrder,
    getOrder
};