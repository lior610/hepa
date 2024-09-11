const express = require("express");
const router = express.Router()
const usersController = require("../controllers/users")

router.route("/").get(usersController.showAllUsers)
router.route("/user").get()
router.route("/user/:id").delete(usersController.deleteUser).post(usersController.editUser).get(usersController.getUser)
router.route("/adduser").post((req, res) => {
    usersController.createUser(req, res)
})

module.exports = router;
