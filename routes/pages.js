const express = require('express');
const router = express.Router();
const loginController = require("../controllers/login");
const path = require("path");

router.get("/personal_area.html", loginController.isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'personal_area.html'));
});

router.get("/admin.html", loginController.isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

router.get("/edit_concert.html", loginController.isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'edit_concert.html'));
});

module.exports = router;