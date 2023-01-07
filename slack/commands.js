const express = require("express");
const commandRoutes = express.Router();


commandRoutes.use("/dinner_message", (req, res) => {
    console.log(req);
    res.send("Request Received")
})

commandRoutes.use("/request_zork", (req, res) => {
    console.log(req);
    res.send("Request Received")
})

module.exports = commandRoutes