const express = require("express")
const users = require("./routes/users")  // create route for every model
const login = require("./routes/login")
const orders = require("./routes/orders");
const concerts = require("./routes/concerts");  // create route for every model
const places = require("./routes/places");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const session = require("express-session")
const pages = require("./routes/pages")

require('custom-env').env(process.env.NODE_ENV, "./config") //take the env varible 
mongoose.connect(process.env.CONNECTION_STRING); //connect to mongo using the given env varible

const server = express();
server.use(session({
    secret: "krembo",
    saveUninitialized: false,
    resave: false
}))

// Increase the limit for JSON payloads
server.use(express.json({ limit: '1000mb' })); 

// Increase the limit for URL-encoded payloads
server.use(express.urlencoded({ limit: '1000mb', extended: true }));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// apis
server.use('/api_users', users) // for (x,y) - when you get x, do y
server.use('/api_login', login)
server.use('/api_orders', orders)
server.use('/api_concerts', concerts)
server.use('/api_places', places);

// HTML files - pages first so it checks it before.
server.use('/', pages);
server.use(express.static("public"))  //use files in public folder

server.listen(80)

