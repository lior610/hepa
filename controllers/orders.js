const ordersService = require("../services/orders")

const showAllOrders = async (req, res) => {
    orders = await ordersService.getOrders();
    return res.json(orders); //use 'json' function of res, enter 'orders' inside to get all of the orders
}

const createOrder = async (req, res) => {
    const newOrder = await ordersService.createOrder(req.body.owner,
                                                  req.body.concert,
                                                  req.body.ticket_number,
                                                  req.body.payment,
                                                )
    res.redirect("/orders.html")
}

const editOrder = async (req, res) => {
    const updatedOrder = await ordersService.editOrder(req.params.id,
                                                    req.body.owner,
                                                    req.body.concert,
                                                    req.body.ticket_number,
                                                    req.body.status,
                                                    req.body.date,
                                                    req.body.payment,
                                                )
    res.redirect("/orders.html") //redirect every func to rellevat page 
}

async function getOrder(req, res) {
    const orderId = req.params.id  //export the id from the parameters of the request
    const order = await ordersService.getOrder(orderId);
    return res.json(order);
}

async function getUserOrders(req, res) {
    const owner = req.query.owner  //export the owner from the parameters of the request
    console.log("the user is ", owner)
    const orders = await ordersService.getUserOrders(owner);
    return res.json(orders);
}

async function deleteOrder(req, res) {
    const orderId = req.params.id //export the id from the parameters of the request

    try {
        await ordersService.deleteOrder(orderId);
        res.status(200).send("deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting order: " + error.message);
    }
}
module.exports = {showAllOrders, createOrder, deleteOrder, editOrder, getOrder, getUserOrders}