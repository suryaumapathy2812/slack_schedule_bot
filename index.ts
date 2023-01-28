
import express, { Request, Response } from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

import { slackEvents, slackInteraction, slackCommand } from "./new/connections/slackConn";

const app = express();
const port = process.env.PORT || 3000;
const connectionString = process.env.ATLAS_URI || "";


(async () => {

    try {

        await mongoose.connect(connectionString, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })

        app.use('/slack/events', slackEvents.requestListener())
        app.use('/slack/interactions', slackInteraction.requestListener())

        app.get("/", (_req: Request, res: Response) => {
            res.send("Server is working")
        })

        app.use("/start", (_req, res) => {
            res.send("Server is working")
        })

        app.use("/slack/command/", [bodyParser.json(), bodyParser.urlencoded({ extended: true })], slackCommand)

        await app.listen(port, function () {
            console.log(`app is running on port ${port}!`)
        })

    } catch (error) {
        console.log(error)
    }
})();

module.exports = { app }