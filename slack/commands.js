const express = require("express");
const commandRoutes = express.Router();


commandRoutes.post("/dinner_message", (req, res) => {
    console.log(req.body);
    res.send("Request Received")
})

commandRoutes.post("/request_zork", (req, res) => {
    console.log(req.body);
    res.send("Request Received")
})

module.exports = commandRoutes