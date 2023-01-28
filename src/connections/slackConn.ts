import express from "express";
import { WebClient } from "@slack/client";
import { LogLevel } from "@slack/web-api"

import { commandController, slackEvents, slackInteraction } from "../controller/controllers"


// const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)

// const slackEvents = createEventAdapter(signing_secret);
// const slackInteraction = createMessageAdapter(signing_secret);

const slackWeb = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
    logLevel: LogLevel.DEBUG
});


const slackCommand = express.Router();

slackCommand.all("**", commandController)
slackInteraction

export { slackWeb, slackEvents, slackInteraction, slackCommand }