const usersService = require("../services/users")

const emptyHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const showAllUsers = async (req, res) => {
    users = await usersService.getUsers();
    return res.json(users);
}

const editUser = async (req, res) => {
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    try {
        const updatedUser = await usersService.editUser(req.params.id,
                                                    //req.body.username - no more needed 
                                                    req.body.full_name,
                                                    req.body.password,
                                                    req.body.mail,
                                                    req.body.phone,
                                                    address,
                                                    req.body.gender,
                                                    req.body.kind
                                                    )
        if (updatedUser) {
            res.redirect("/") //redirect every func to rellevat page 
        } else {
            res.status(404).send(`username ${req.params.id} not found`)
        }
    } catch (e) {
        return res.status(500).send(e.message);
    }
}
const editUserDetails = async (req, res) => {    
    console.log("controller edit user details for ", req.params.id)
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
        try {
        const updatedUser = await usersService.editUserDetails(req.params.id,
                                                    req.body.full_name,
                                                    req.body.password,
                                                    req.body.mail,
                                                    req.body.phone,
                                                    address,
                                                    req.body.gender,
                                                    req.body.kind
                                                    )
        if (updatedUser) {
            res.redirect("/personal_area.html") //redirect every func to rellevat page 
        } else {
            res.status(404).send(`username ${req.params.id} not found`)
        }
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

const adminEditUserDetails = async (req, res) => {    
    console.log("controller edit user details for ", req.params.id);

    // Build the address object
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    };

    try {
        // If password is empty or null, do not pass it to the service function
        const password = req.body.password && req.body.password.trim() !== '' && req.body.password.trim() != emptyHash ? req.body.password : null;
        const updatedUser = await usersService.adminEditUserDetails(
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

async function deleteUser(req, res) {
    const username = req.params.id

    try {
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

module.exports = {showAllUsers, deleteUser, editUser, getUser,editUserDetails, adminEditUserDetails}