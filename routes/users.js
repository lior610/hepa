const express = require("express");
const router = express.Router()
const usersController = require("../controllers/users")
const loginController = require("../controllers/login")
const loginService = require("../services/login");

async function isCurrentUserOrAdmin(req, res, next) {
    if (typeof req.session.username == "undefined") {
        return res.status(403).send("Unauthorized");
    }
    const username = req.session.username;
    const userId = req.params.id;
    const isAdmin = await loginService.isAdmin(username)

    if (username === userId || isAdmin) {
        return next();
    } else {
        return res.status(403).send("Unauthorized");
    }
}

router.route("/").get(loginController.isAdmin, usersController.showAllUsers)
router.route("/user/:id")
    .delete(loginController.isAdmin, usersController.deleteUser)
    .post(isCurrentUserOrAdmin, usersController.editUser)
    .get(isCurrentUserOrAdmin, usersController.getUser)
module.exports = router;