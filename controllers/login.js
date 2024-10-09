const loginService = require("../services/login")
const userService = require("../services/users")

function isLoggedIn(req, res, next) {
    console.log(req.session.username)
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
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    console.log(req.body);
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
    getUsername,
    getFullName
}