const loginService = require("../services/login")
const userService = require("../services/users")

function isLoggedIn(req, res, next) {
    if (req.session.username != null) return next();
    else res.redirect("/login.html");
}

async function isAdmin(req, res, next) {
    const isAdmin = await loginService.isAdmin(req.session.username);
    if (isAdmin) {
        return next();
    } else {
        res.redirect("/homepage.html");
    }
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/homepage.html");
    })
}

async function login(req, res) {
    let { username, password } = req.body
    username = username.toLowerCase();
    const result = await loginService.login(username, password)
    if (result) {
        req.session.username = username;
        const user = await userService.getUser(username);
        req.session.fullname = user["full_name"];
        res.redirect("/homepage.html")
    } else {
        res.redirect("/login.html?error=1")
    }
}

async function register(req, res) {
    if (!loginService.validateEmail(req.body.mail)) {
        const errorTitle = "Invalid Mail";
        const errorMessage = "Oops! The e-mail is not on the right format. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
    }
    if (!loginService.validatePhone(req.body.phone)) {
        const errorTitle = "Invalid phone number";
        const errorMessage = "Oops! The phone number is not on the right format. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
    }
    if (!loginService.validateFields(req.body)) {
        const errorTitle = "One of the fields is missing";
        const errorMessage = "Oops! One of the fields is missing. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
    }
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    try {
        if (await userService.getUser(req.body.username.toLowerCase())) {
            return res.redirect("/register.html?error=1")
        }
    
        const newUser = await loginService.register(req.body.username.toLowerCase(),
                                                    req.body.full_name,
                                                    req.body.password,
                                                    req.body.mail,
                                                    req.body.phone,
                                                    address,
                                                    req.body.gender,
                                                    )
        res.redirect("/login.html")
    } catch (e) {
        res.status(500).send("Error during adding " + e.message);
    }
}

async function adminAddUser(req, res) {
    if (!loginService.validateEmail(req.body.mail)) {
        const errorTitle = "Invalid Mail";
        const errorMessage = "Oops! The e-mail is not on the right format. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
    }
    if (!loginService.validatePhone(req.body.phone)) {
        const errorTitle = "Invalid phone number";
        const errorMessage = "Oops! The phone number is not on the right format. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
    }
    if (!loginService.validateFields(req.body)) {
        const errorTitle = "One of the fields is missing";
        const errorMessage = "Oops! One of the fields is missing. Please check and try again.";
            
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
    }
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    try {
        if (await userService.getUser(req.body.username.toLowerCase())) {
            return res.redirect("/register.html?error=1")
        }
    
        const newUser = await loginService.adminAddUser(req.body.username.toLowerCase(),
                                                    req.body.full_name,
                                                    req.body.password,
                                                    req.body.mail,
                                                    req.body.phone,
                                                    address,
                                                    req.body.gender,
                                                    req.body.kind
                                                    )
        res.redirect("/admin.html")
    } catch (e) {
        res.status(500).send("Error during adding " + e.message);
    }
}

async function getUsername(req, res) {
    const isAdmin = await loginService.isAdmin(req.session.username);
    return res.json({ username: req.session.username, "Admin": isAdmin})
}

async function getFullName(req, res) {
    return res.json({ fullname: req.session.fullname})
}

module.exports = {
    isLoggedIn,
    isAdmin,
    logout,
    login,
    register,
    adminAddUser,
    getUsername,
    getFullName
}