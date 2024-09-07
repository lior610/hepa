const express = require("express");
const router = express.Router()
const ordersController = require("../controllers/orders")

router.route("/").get(ordersController.showAllOrders)
//router.route("/order").get()
router.route("/order/:id").delete(ordersController.deleteOrder).post(ordersController.editOrder).get(ordersController.getOrder)
router.route("/addorder").post((req, res) => {
    ordersController.createOrder(req, res)
})

module.exports = router;
