const usersService = require("../services/users")

const showAllUsers = async (req, res) => {
    users = await usersService.getUsers();
    return res.json(users);
}

const createUser = async (req, res) => {
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    const newUser = await usersService.createUser(req.body.full_name,
                                                  req.body.username,
                                                  req.body.password,
                                                  req.body.mail,
                                                  req.body.phone,
                                                  address,
                                                  req.body.gender,
                                                )
    res.redirect("/")
}

const editUser = async (req, res) => {
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    const updatedUser = await usersService.editUser(req.params.id,
                                                  req.body.full_name,
                                                  req.body.username,
                                                  req.body.password,
                                                  req.body.mail,
                                                  req.body.phone,
                                                  address,
                                                  req.body.gender,
                                                  req.body.kind
                                                )
    res.redirect("/")
}

async function getUser(req, res) {
    const userId = req.params.id
    user = await usersService.getUser(userId);
    return res.json(user);
}

async function deleteUser(req, res) {
    const userId = req.params.id

    try {
        await usersService.deleteUser(userId);
        res.status(200).send("added successfully");
    } catch (error) {
        res.status(500).send("Error deleting user: " + error.message);
    }
}
module.exports = {showAllUsers, createUser, deleteUser, editUser, getUser}