const express = require("express");
const users = require("./routes/users");  // create route for every model
const orders = require("./routes/orders");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

require('custom-env').env(process.env.NODE_ENV, "./config") //take the env varible 
mongoose.connect(process.env.CONNECTION_STRING); //connect to mongo using the given env varible

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))  //use files in public folder
server.use('/api_users', users) // for (x,y) - when you get x, do y
server.use('/api_orders', orders)

server.listen(80)