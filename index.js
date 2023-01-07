
const express = require("express")
const mongoose = require("mongoose")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


const eventsApp = require("./slack/events")
const interactionApp = require("./slack/interaction")

// const { LogLevel } = require('@slack/web-api');
// const { eventsClient } = require("./connection/eventsApi")
// const { socketModeClient } = require("./connection/socketMode")

const app = express();
const port = process.env.PORT;
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

        app.use("/start", (req, res) => {
            res.send("Server is working")
        })

    } catch (error) {
        console.log(error)
    }
})();