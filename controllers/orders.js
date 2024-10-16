const ordersService = require("../services/orders")
const concertService = require("../services/concerts")

const showAllOrders = async (req, res) => {
    orders = await ordersService.getOrders();
    return res.json(orders); //use 'json' function of res, enter 'orders' inside to get all of the orders
}

const createOrder = async (req, res) => {
    const { owner, concert, concert_id, tickets_number } = req.body; //short way for casting each part of body
    try {
        // Validate owner
        const ownerValid = await ordersService.ownerExists(owner);
        if (!ownerValid) {
            const errorTitle = "Invalid Owner";
            const errorMessage = "Oops! Owner username does not exist. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }

        // Validate concert exist and matches id
        const concertValid = await ordersService.concertExists(concert, concert_id);
        if (!concertValid) {
            const errorTitle = "Invalid Request";
            const errorMessage = "Oops! Concert does not exist with this id. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }

        // Validate ticket availability
        const ticketsValid = await ordersService.checkTicketAvailability(concert_id, tickets_number);
        if (!ticketsValid) {
            const errorTitle = "Invalid Request";
            const errorMessage = "Oops! Not enough tickets available. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }

        // Validate date is in the future
        const concertDateValid = await ordersService.checkConcertDate(concert_id);
        if (!concertDateValid) {
            const errorTitle = "Invalid Request";
            const errorMessage = "Oops! Concert is in the past. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }

        // If validation passes, proceed to create the order
        const newOrder = await ordersService.createOrder(req.body.owner,
                                                    req.body.concert,
                                                    req.body.concert_id,
                                                    req.body.tickets_number,
                                                    req.body.payment,
                                                    )                                         
    } catch (error) {
        console.log(error)
    }
    
}

const editOrder = async (req, res) => {
    const { owner, concert, concert_id, tickets_number} = req.body; //short way for casting each part of body
    try {
        // Validate owner
        const ownerValid = await ordersService.ownerExists(owner);
        console.log(owner);
        if (!ownerValid) {
            const errorTitle = "Invalid Owner";
            const errorMessage = "Oops! Owner username does not exist. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }

        // Validate concert exist and matches id
        const concertValid = await ordersService.concertExists(concert, concert_id);
        if (!concertValid) {
            const errorTitle = "Invalid Request";
            const errorMessage = "Oops! Concert does not exist with this id. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }

        // Validate ticket availability
        const ticketsValid = await ordersService.checkTicketAvailability(concert_id, tickets_number);
        if (!ticketsValid) {
            const errorTitle = "Invalid Request";
            const errorMessage = "Oops! Not enough tickets available. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }    

        // Validate date is in the future
        const concertDateValid = await ordersService.checkConcertDate(concert_id);
        if (!concertDateValid) {
            const errorTitle = "Invalid Request";
            const errorMessage = "Oops! Concert is in the past. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }
        // If validation passes, proceed to create the order
        const updatedOrder = await ordersService.editOrder(req.params.id,
            req.body.owner,
            req.body.concert,
            req.body.concert_id, 
            req.body.tickets_number,
            req.body.status,
            req.body.date,
            req.body.payment,
        )
        res.redirect("/admin.html") //redirect every func to rellevat page 
    } catch (error) {
        console.log(error)
    }
    
}

async function getOrder(req, res) {
    const orderId = req.params.id  //export the id from the parameters of the request
    const order = await ordersService.getOrder(orderId);
    // deletedOrderTicketsUpdate(orderId);
    return res.json(order);
}

async function getUserOrders(req, res) {
    const owner = req.query.owner  //export the owner from the parameters of the request
    const orders = await ordersService.getUserOrders(owner);
    return res.json(orders);
}

async function getClosedOrders(req, res) {
    orders = await ordersService.getClosedOrders();
    return res.json(orders); //use 'json' function of res, enter 'orders' inside to get all of the orders
}

async function deletedOrderTicketsUpdate(order_id) {

    let order;

    try {
        order = await ordersService.getOrder(order_id);
    } catch (e) {
        res.status(404).send("order not found")
        return;
    }
    const status = order[0]["status"]
    const concert_id = order[0]["concert_id"]
    let order_tickets = order[0]["tickets_number"]
    const res = await concertService.getConcert(concert_id);
    let ticketsNumber = res[0]["tickets_available"];

    ticketsNumber += order_tickets;
    if (status == "close") {
        await concertService.editTicketsForConcert(concert_id, ticketsNumber)
    }
}

async function deleteOrder(req, res) {
    const orderId = req.params.id //export the id from the parameters of the request

    try {
        await deletedOrderTicketsUpdate(orderId);
        await ordersService.deleteOrder(orderId);
        res.status(200).send("deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting order: " + error.message);
        console.log(error)
    }
}
module.exports = {showAllOrders, createOrder, deleteOrder, editOrder, getOrder, getUserOrders, getClosedOrders}
