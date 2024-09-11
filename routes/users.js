const express = require("express");
const router = express.Router()
const usersController = require("../controllers/users")

router.route("/").get(usersController.showAllUsers)
router.route("/user/:id").delete(usersController.deleteUser).post(usersController.editUser).get(usersController.getUser)

module.exports = router;
