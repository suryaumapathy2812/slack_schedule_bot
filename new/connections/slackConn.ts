import express from "express";
import { WebClient } from "@slack/client";
import { createEventAdapter } from "@slack/events-api"
import { createMessageAdapter } from "@slack/interactive-messages"
import { LogLevel } from "@slack/web-api"
import { commandController } from "./../controller/command.controller"

const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)

const slackEvents = createEventAdapter(signing_secret);
const slackInteraction = createMessageAdapter(signing_secret);

const slackWeb = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
    logLevel: LogLevel.DEBUG
});

const slackCommand = express.Router();

slackCommand.all("**", commandController)

export { slackWeb, slackEvents, slackInteraction, slackCommand }