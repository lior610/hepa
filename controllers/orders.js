const ordersService = require("../services/orders")
// require the validation functions from the model - maybe there is another way 
const { ownerExists, concertExists, checkTicketAvailability } = require('../models/orders.js');

const showAllOrders = async (req, res) => {
    orders = await ordersService.getOrders();
    return res.json(orders); //use 'json' function of res, enter 'orders' inside to get all of the orders
}

const createOrder = async (req, res) => {
    const { owner, concert, ticket_number } = req.body; //short way for casting each part of body
    try {
        // Validate owner
        const ownerValid = await ownerExists(owner);
        if (!ownerValid) {
            return res.status(400).json({ message: 'Owner does not exist.' });
        }

        // Validate concert
        const concertValid = await concertExists(concert);
        if (!concertValid) {
            return res.status(400).json({ message: 'Concert does not exist.' });
        }

        // Validate ticket availability
        const ticketsValid = await checkTicketAvailability(concert, ticket_number);
        if (!ticketsValid) {
            return res.status(400).json({ message: 'Not enough tickets available.' });
        }

        // If validation passes, proceed to create the order
        const newOrder = await ordersService.createOrder(req.body.owner,
                                                    req.body.concert,
                                                    req.body.ticket_number,
                                                    req.body.payment,
                                                    )        
        res.status(201).json({ message: 'Order created successfully' });
        res.redirect("/orders.html")
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
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