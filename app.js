const express = require("express");
const users = require("./routes/users");  // create route for every model
const concerts = require("./routes/concerts");  // create route for every model
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

require('custom-env').env(process.env.NODE_ENV, "./config") //take the env varible 
mongoose.connect(process.env.CONNECTION_STRING); //connect to mongo using the given env varible

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))  //use files in public folder

server.use('/api_concerts', concerts) 
server.use('/api_users', users) 
server.listen(80)

