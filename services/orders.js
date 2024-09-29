const Order = require("../models/orders")

//what user action causes order creation?
const createOrder = async (owner, concert, ticket_number,
    payment) => {
        const order = new Order({ //new user how did it work? - why not found?
            owner, concert, ticket_number, payment
        });
        order.status = "open"
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);  // Output will be in YYYY-MM-DD format
        order.date = formattedDate;

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
    let order = await Order.find({"_id": orderId})
    return order;
}

const getUserOrders = async(owner) => {
    console.log("im in services, the user is ", owner)
    let orders = await Order.find({"owner": owner})
    return orders; //returns an arr of all orders that owname is given user (by full name at the time)
}

module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
    editOrder,
    getOrder,
    getUserOrders
};