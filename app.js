const express = require("express");
const users = require("./routes/users");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

require('custom-env').env(process.env.NODE_ENV, "./config")
mongoose.connect(process.env.CONNECTION_STRING);

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))
server.use(users)

server.listen(80)