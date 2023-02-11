// import { slackEvents } from "./../connections/slackConn"

import { createEventAdapter } from "@slack/events-api";
import { EventService } from "../services/event.service";


const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)
const slackEvents = createEventAdapter(signing_secret);

slackEvents.on("app_mention", async (event) => {
    console.log(`Received an app_mention event from user ${event.user} in channel ${event.channel}`);
    console.log(event)
})


slackEvents.on("app_home_opened", async (event) => {
    console.log("Event triggered :  app_home_opened ")
    console.log(event);
    const { user: userId, channel } = event;
    const eventService = new EventService();
    eventService.appHomeMention(userId, channel)
})



export { slackEvents }


