const express = require("express");
const router = express.Router()
const usersController = require("../controllers/users")

router.route("/").get(usersController.showAllUsers)
//router.route("/user").get()
//router.route("/deleteuser").get()
router.route("/adduser").get(usersController.addUser).post((req, res) => {
    usersController.createUser(req, res)
})

module.exports = router;
