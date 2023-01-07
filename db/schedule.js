const express = require("express");

const dbo = require("./../connection/database")

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();


recordRoutes.route("/listings").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("polls")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
});