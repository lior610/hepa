const express = require("express");
const router = express.Router()
const ordersController = require("../controllers/orders")
const orderService = require("../services/orders")
const loginController = require("../controllers/login")
const loginService = require("../services/login");

async function isCurrentUserOrAdmin(req, res, next) {
    if (typeof req.session.username == "undefined") {
        return res.status(403).send("Unauthorized");
    }
    const username = req.session.username;
    const owner = req.body.owner || req.query.owner;
    const isAdmin = await loginService.isAdmin(username)

    if (username === owner || isAdmin) {
        return next();
    } else {
        return res.status(403).send("Unauthorized");
    }
}

async function isCurrentUserByOrderID(req, res, next) {
    if (typeof req.session.username == "undefined") {
        return res.status(403).send("Unauthorized");
    }
    const username = req.session.username;
    let order;
    try {
        order = await orderService.getOrder(req.params.id);
        if (order.length === 0) {
            return res.status(404).send("Order not found")
        }
    } catch (e) {
        return res.status(500).send("error retrieving error " + e);
    }

    const owner = order[0].owner;
    const isAdmin = await loginService.isAdmin(username)

    if (username === owner || isAdmin) {
        return next();
    } else {
        return res.status(403).send("Unauthorized");
    }
}

router.route("/").get(loginController.isAdmin, ordersController.showAllOrders)
router.route("/order/:id")
    .delete(isCurrentUserByOrderID, ordersController.deleteOrder)
    .post(isCurrentUserOrAdmin, ordersController.editOrder)
    .get(isCurrentUserByOrderID, ordersController.getOrder)

router.route("/add_order").post(loginController.isLoggedIn, (req, res) => {
    ordersController.createOrder(req, res)
})

router.route("/orders/by-owner").get(isCurrentUserOrAdmin, ordersController.getUserOrders)
router.route("/orders/closed").get(loginController.isAdmin, ordersController.getClosedOrders)

module.exports = router;
