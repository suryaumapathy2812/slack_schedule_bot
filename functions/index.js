
const functions = require("firebase-functions");
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

// if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
// }

const eventsApp = require("./slack/events")
const interactionApp = require("./slack/interaction")
const commandRoutes = require("./slack/commands")


const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const connectionString = process.env.ATLAS_URI;


(async () => {

    try {

        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        eventsApp.listenForEvents(app);
        interactionApp.listenForInteraction(app);

        app.get("/", (req, res) => {
            res.send("Server is working")
        })

        app.use("/start", (req, res) => {
            res.send("Server is working")
        })

        app.use("/slack/command/", [bodyParser.json(), bodyParser.urlencoded({ extended: true })], commandRoutes)

        await app.listen(port, function () {
            console.log(`app is running on port ${port}!`)
        })

    } catch (error) {
        console.log(error)
    }
})();

exports.app = functions.https.onRequest(app)