const express = require("express")
const users = require("./routes/users")  // create route for every model
const login = require("./routes/login")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")

require('custom-env').env(process.env.NODE_ENV, "./config") //take the env varible 
mongoose.connect(process.env.CONNECTION_STRING); //connect to mongo using the given env varible

const server = express();
server.use(session({
    secret: "krembo",
    saveUninitialized: false,
    resave: false
}))

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))  //use files in public folder
server.use('/api_users', users) // for (x,y) - when you get x, do y
server.use('/api_login', login)

server.listen(80)