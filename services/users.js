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

const editUserDetails = async (username, full_name, password, mail, phone, address, gender, kind) => { 
    try {
        // Find and update the user document 
        const updatedUser = await User.findOneAndUpdate(
            { "_id": username },  // Find by the username (_id)
            { 
                full_name,          
                password, 
                mail, 
                phone, 
                address, 
                gender, 
                kind 
            },
            { new: true, runValidators: true }  // Return the updated document and apply validation
        );

        if (!updatedUser) {
            return null; // User not found
        }

        return updatedUser;
    } catch (error) {
        throw new Error(`Failed to edit user: ${error.message}`);
    }
};

const adminEditUserDetails = async (username, full_name, password, mail, phone, address, gender, kind) => { 
    try {
        // Create an update object with the fields that will be updated
        const updateFields = {
            full_name,
            mail,
            phone,
            address,
            gender,
            kind
        };

        // Only add the password to the update object if it's provided (not null or empty)
        if (password) {
            updateFields.password = password;
        }

        // Find and update the user document
        const updatedUser = await User.findOneAndUpdate(
            { "_id": username },  // Find by the username (_id)
            updateFields,         // Only update the fields in the updateFields object
            { new: true, runValidators: true }  // Return the updated document and apply validation
        );

        if (!updatedUser) {
            return null;  // User not found
        }

        return updatedUser;
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
    editUserDetails,
    adminEditUserDetails,
    getUser
};