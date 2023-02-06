// import { slackEvents } from "./../connections/slackConn"

import { createEventAdapter } from "@slack/events-api";


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


export { slackEvents }

function messagePatternRecognize(message: any): { channel: any; template: any; } {
    throw new Error("Function not implemented.");
}


