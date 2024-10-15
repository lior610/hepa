const express = require('express');
const router = express.Router();
const loginController = require("../controllers/login");
const path = require("path");

router.get("/personal_area.html", loginController.isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'personal_area.html'));
});

// router.get("/admin.html", loginController.isAdmin, (req, res) => {
//     res.sendFile(path.join(__dirname, '../public', 'admin.html'));
// });

router.get("/edit_:page.html", loginController.isAdmin, (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, '../public', `edit_${page}.html`));
});

// router.get("/admin/:page.html", loginController.isAdmin, (req, res) => {
//     const page = req.params.page;
//     res.sendFile(path.join(__dirname, '../public/admin', `${page}.html`));
// });


module.exports = router;