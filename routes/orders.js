const express = require("express");
const router = express.Router()
const ordersController = require("../controllers/orders")

router.route("/").get(ordersController.showAllOrders)
router.route("/order/:id").delete(ordersController.deleteOrder).post(ordersController.editOrder).get(ordersController.getOrder)
router.route("/add_order").post((req, res) => {
    ordersController.createOrder(req, res)
})
router.route("/orders/by-owner").get(ordersController.getUserOrders)
router.route("/orders/closed").get(ordersController.getClosedOrders)

module.exports = router;
