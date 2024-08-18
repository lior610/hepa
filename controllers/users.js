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

//{ users : usersModel.getAllUsers() }

// function addUser(req, res) {
//     res.render("addUser.ejs")
// }

// function deleteArticle(req, res) {
//     const articleId = req.query.id
//     articleModel.deleteArticle(articleId)
//     //showAllArticles(req, res);
//     res.redirect("/")
// }
module.exports = {showAllUsers, createUser}