const express = require("express");
const concerts = require("./routes/concerts");  // create route for every model
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

require('custom-env').env(process.env.NODE_ENV, "./config") //take the env varible 
mongoose.connect(process.env.CONNECTION_STRING); //connect to mongo using the given env varible

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))  //use files in public folder
server.use('/api', concerts) // for (x,y) - when you get x, do y

server.listen(8080)