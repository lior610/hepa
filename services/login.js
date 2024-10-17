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

async function adminAddUser(username, full_name, password,
    mail, phone, address, gender, kind) {
        const user = new User({
            _id: username, full_name, password, mail, phone, 
            address, gender, kind
        });

        await user.save();
}

async function isAdmin(username) {
    const user = await User.findOne({_id: username});
    try {
        type = user.kind; 
    } catch (error) {
        return false
    }
    return user.kind == "Admin";
}

function validateEmail(email) {
    var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(email)
}

function validatePhone(phone) {
    return phone.length === 10 && /^[0-9]{10}$/.test(phone)
}

function validateFields(data) {
    for (let [key, value] of Object.entries(data)) {
        if (value == null || value == "") {
            return false;
        }
    }
    return true;
}

module.exports = { login, 
                   register,
                   adminAddUser, 
                   isAdmin,
                   validatePhone,
                   validateEmail,
                   validateFields }