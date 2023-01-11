import { createEventAdapter } from "@slack/events-api"
import { createMessageAdapter } from "@slack/interactive-messages"
import { LogLevel, WebClient } from "@slack/web-api"

const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)

const slackEvents = createEventAdapter(signing_secret);
const slackInteraction = createMessageAdapter(signing_secret);

const slackWeb = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
    logLevel: LogLevel.DEBUG
});


export { slackEvents, slackInteraction, slackWeb }