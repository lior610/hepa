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

const deleteUser = async (userId) => {
    return await User.deleteOne({"_id": userId});
}

const editUser = async (userId, full_name, username, password,
    mail, phone, address, gender, kind) => {
    const data = {full_name, username, password,
        mail, phone, address, gender, kind}
    return await User.updateOne({"_id": userId}, data)
}

const getUser = async(userId) => {
    let users = await User.find({"_id": userId})
    return users;
}

module.exports = {
    createUser,
    getUsers,
    deleteUser,
    editUser,
    getUser
};