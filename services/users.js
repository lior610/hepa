const User = require("../models/users")

const getUsers = async () => {
    let users = await User.find({})
    return users;
}

const deleteUser = async (username) => {
    try {
        const result = await User.deleteOne({ "_id": username });
        if (result.deletedCount === 0) {
            return null;
        }
        console.log(result);
        return result;
    } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }
};

const editUser = async (currentUsername, newUsername, password, mail, phone, address, gender, kind) => {
    const data = { username: newUsername, password, mail, phone, address, gender, kind };

    try {
        // Find the existing user document
        const existingUser = await User.findOne({ "_id": currentUsername });
        if (!existingUser) {
            return null
        }

        // Create a new document with the new username
        const newUser = new User({ ...data });
        await newUser.save();

        // Delete the old user document
        await User.deleteOne({ "_id": currentUsername });

        return newUser;
    } catch (error) {
        throw new Error(`Failed to edit user: ${error.message}`);
    }
};


const getUser = async(username) => {
    let users = await User.find({"_id": username})
    return users[0];
}

module.exports = {
    getUsers,
    deleteUser,
    editUser,
    getUser
};