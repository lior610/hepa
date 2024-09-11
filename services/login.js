const User = require("../models/users");

async function login(username, password) {
    const user = await User.findOne({_id: username, password});
    return user != null;
}

async function register(username, full_name, password,
    mail, phone, address, gender) {
        const user = new User({
            _id: username, full_name, password, mail, phone, 
            address, gender
        });
        user.kind = "regular"

        await user.save();
}

async function isAdmin(username) {
    const user = await User.findById(username);
    try {
        type = user.kind; 
    } catch (error) {
        return false
    }
    return user.kind == "Admin";
}

module.exports = { login, 
                   register, 
                   isAdmin }