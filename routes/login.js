const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login");

router.route("/login").post(loginController.login)
router.route("/logout").get(loginController.isLoggedIn, loginController.logout)
router.route("/register").post(loginController.register)
router.route("/adminAddUser").post(loginController.isAdmin, loginController.adminAddUser)
router.route("/username").get(loginController.getUsername)
router.route("/fullname").get(loginController.getFullName)

module.exports = router;