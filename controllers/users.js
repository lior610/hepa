const usersService = require("../services/users")
const ordersController = require("./orders")
const ordersService = require("../services/orders")
const concertsService = require("../services/concerts")
const loginService = require("../services/login")

const emptyHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const showAllUsers = async (req, res) => {
    users = await usersService.getUsers();
    return res.json(users);
}

const editUser = async (req, res) => {
    // get the page that sends the request
    let uri;
    const referer = req.get('referer');
    if (referer) {
        const refererUrl = new URL(referer);
        uri = `${refererUrl.pathname}${refererUrl.search}`;
    } else {
        return res.status(500).send("No referer found");
    }

    console.log("controller edit user details for ", req.params.id);
    if (!loginService.validateEmail(req.body.mail)) {
        const errorTitle = "Invalid Mail";
        const errorMessage = "Oops! The e-mail is not on the right format. Please check and try again.";
        
        if (uri == "/personal_area.html") {
            return res.status(400).json({ errorTitle, errorMessage });
        } else {
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }
    }
    if (!loginService.validatePhone(req.body.phone)) {
        const errorTitle = "Invalid phone number";
        const errorMessage = "Oops! The phone number is not on the right format. Please check and try again.";
            
        if (uri.trim() == "/personal_area.html") {
            return res.status(400).json({ errorTitle, errorMessage });
        } else {
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }
    }
    if (!usersService.validateEditUserFields(req.body)) {
        const errorTitle = "One of the fields is missing";
        const errorMessage = "Oops! One of the fields is missing. Please check and try again.";
        if (uri == "/personal_area.html") {
            return res.status(400).json({ errorTitle, errorMessage });
        } else {
            res.redirect(`/error_404.html?title=${errorTitle}&message=${errorMessage}`);
            return;
        }
    }
    // Build the address object
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    };

    try {
        // If password is empty or null, do not pass it to the service function
        const password = req.body.password && req.body.password.trim() !== '' && req.body.password.trim() != emptyHash ? req.body.password : null;
        const updatedUser = await usersService.editUser(
            req.params.id,
            req.body.full_name,
            password,  // Pass null if password should not be updated
            req.body.mail,
            req.body.phone,
            address,
            req.body.gender,
            req.body.kind
        );

        if (updatedUser) {
            res.redirect("/admin.html");
        } else {
            res.status(404).send(`username ${req.params.id} not found`);
        }
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

async function getUser(req, res) {
    const username = req.params.id
    user = await usersService.getUser(username);
    return res.json(user);
}

async function deleteUserOrders(username) {
    const orders = await ordersService.getUserOrders(username);
    for (let order of orders) {
        const concert = await concertsService.getConcert(order.concert_id)
        let today = new Date();
        if (new Date(concert[0].date) >= today) {
            await ordersController.deleteOrder({ params: { id: order._id } }, { status: () => ({ send: () => {} }) });
        }
    }
    
}

async function deleteUser(req, res) {
    const username = req.params.id

    try {
        await deleteUserOrders(username)
        const result = await usersService.deleteUser(username);
        if (result){
            res.status(200).send("deleted successfully");
        } else {
            res.status(404).send(`username ${username} doesn't exist`)
        }
    } catch (error) {
        res.status(500).send("Error deleting user: " + error.message);
    }
}

module.exports = {showAllUsers, deleteUser, editUser, getUser}