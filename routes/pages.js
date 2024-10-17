const express = require('express');
const router = express.Router();
const loginController = require("../controllers/login");
const path = require("path");

async function isNotLoggedIn(req, res, next) {
    if (req.session.username) {
        return res.redirect("/")
    } else {
        next()
    }
}

router.get("/personal_area.html", loginController.isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'personal_area.html'));
});

router.get("/admin.html", loginController.isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

router.get("/edit_:page.html", loginController.isAdmin, (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, '../public', `edit_${page}.html`));
});

router.get("/admin/:page.html", loginController.isAdmin, (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, '../public/admin', `${page}.html`));
});

router.get("/login.html", isNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get("/register.html", isNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});


module.exports = router;