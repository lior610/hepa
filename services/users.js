const User = require("../models/users")

const createUser = async (full_name, username, password,
    mail, phone, address, gender) => {
        const user = new User({
            full_name, username, password, mail, phone, 
            address, gender
        });
        user.kind = "regular"

        return await user.save();
}

const getUsers = async () => {
    let users = await User.find({})
    return users;
}

module.exports = {
    createUser,
    getUsers
};