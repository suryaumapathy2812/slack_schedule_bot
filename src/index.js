
const express = require("express")
const mongoose = require("mongoose")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const eventsApp = require("./slack/events")
const interactionApp = require("./slack/interaction")

const app = express();
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

        await app.listen(port, function () {
            console.log(`app is running on port ${port}!`)
        })

        app.get("/", (req, res) => {
            res.send("Server is working")
        })

        app.use("/start", (req, res) => {
            res.send("Server is working")
        })

    } catch (error) {
        console.log(error)
    }
})();