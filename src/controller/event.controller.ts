// import { slackEvents } from "./../connections/slackConn"

import { createEventAdapter } from "@slack/events-api";
import { EventService } from "../services/event.service";


const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)
const slackEvents = createEventAdapter(signing_secret);

slackEvents.on("app_mention", async (event) => {
    console.log(`Received an app_mention event from user ${event.user} in channel ${event.channel}`);
    console.log(event)

    const { channel: fromChannel, text: message } = event
    const { channel: toChannel, template: templateName } = messagePatternRecognize(message);

    console.log("toChannel", typeof toChannel, toChannel);
    console.log("templateId", typeof templateName, templateName);

    // if (toChannel === null || templateName === null) {
    //     await new SlackMessage().sendMessage(fromChannel, "Hi there, I'm zork. \nHow can I help you");
    // } else {
    //     // await customTemplateMessages(toChannel ?? process.env.DEFAULT_CHANNEL, templateName)

    //     //  !  send messagePoll
    //     const pollMessage = new PollMessageModel().createMessage(toChannel, templateName)
    // }

})



slackEvents.on("app_home_opened", async (event) => {
    console.log("Event triggered :  app_home_opened ")
    console.log(event);

    // {
    //     type: 'app_home_opened',
    //         user: 'U03P09REPUK',
    //             channel: 'D04MCA5794H',
    //                 tab: 'messages',
    //                     event_ts: '1675733509.785199'
    // }


    const { user: userId, channel } = event;

    const eventService = new EventService();
    eventService.appHomeMention(userId, channel)


})



export { slackEvents }

function messagePatternRecognize(message: any): { channel: any; template: any; } {
    throw new Error("Function not implemented.");
}


