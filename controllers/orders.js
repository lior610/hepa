const ordersService = require("../services/orders")

const showAllOrders = async (req, res) => {
    orders = await ordersService.getOrders();
    return res.json(orders); //use 'json' function of res, enter 'orders' inside to get all of the orders
}

const createOrder = async (req, res) => {
    const { owner, concert, concert_id, tickets_number, date } = req.body; //short way for casting each part of body
    try {
        // Validate owner
        const ownerValid = await ordersService.ownerExists(owner);
        if (!ownerValid) {
            return res.status(400).json({ message: 'Owner username does not exist.' });
        }

        // Validate concert exist and matches id
        const concertValid = await ordersService.concertExists(concert, concert_id);
        if (!concertValid) {
            return res.status(400).json({ message: 'Concert does not exist with this id' });
        }

        // Validate ticket availability
        const ticketsValid = await ordersService.checkTicketAvailability(concert_id, tickets_number);
        if (!ticketsValid) {
            return res.status(400).json({ message: 'Not enough tickets available.' });
        }
        // Validate date is in the future
        const concertDateValid = await ordersService.checkConcertDate(concert_id, date);
        if (!concertDateValid) {
            return res.status(400).json({ message: 'Concert is in the past' });
        }

        // If validation passes, proceed to create the order
        const newOrder = await ordersService.createOrder(req.body.owner,
                                                    req.body.concert,
                                                    req.body.concert_id,
                                                    req.body.tickets_number,
                                                    req.body.payment,
                                                    )     
        //   --> we need to decide what to do next   
        //res.status(201).json({ message: 'Order created successfully' });
        //res.redirect("/personal_area.html")                                     
    } catch (error) {
        console.log(error)
    }
    
}

const editOrder = async (req, res) => {
    const { owner, concert, concert_id, tickets_number, status, date } = req.body; //short way for casting each part of body
    try {
        // Validate owner
        const ownerValid = await ordersService.ownerExists(owner);
        if (!ownerValid) {
            return res.status(400).json({ message: 'Owner username does not exist.' });
        }

        // Validate concert exist and matches id
        const concertValid = await ordersService.concertExists(concert, concert_id);
        if (!concertValid) {
            return res.status(400).json({ message: 'Concert does not exist with this id' });
        }

        // Validate ticket availability
        const ticketsValid = await ordersService.checkTicketAvailability(concert_id, tickets_number);
        if (!ticketsValid) {
            return res.status(400).json({ message: 'Not enough tickets available.' });
        }    

        // Validate date is in the future
        const concertDateValid = await ordersService.checkConcertDate(concert_id, date);
        if (!concertDateValid) {
            return res.status(400).json({ message: 'Concert is in the past' });
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
        //res.status(201).json({ message: 'Order created successfully' }); 
    } catch (error) {
        console.log(error)
    }
    
}

async function getOrder(req, res) {
    const orderId = req.params.id  //export the id from the parameters of the request
    const order = await ordersService.getOrder(orderId);
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

async function deleteOrder(req, res) {
    const orderId = req.params.id //export the id from the parameters of the request

    try {
        await ordersService.deleteOrder(orderId);
        res.status(200).send("deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting order: " + error.message);
    }
}
module.exports = {showAllOrders, createOrder, deleteOrder, editOrder, getOrder, getUserOrders, getClosedOrders}