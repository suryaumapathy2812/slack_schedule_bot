const { createEventAdapter } = require("@slack/events-api");
const { messagePatternRecognize } = require("../common/utils");
const { sampleMessage, customMessage, customTemplateMessages } = require("./../connection/webApi")

const slack_events = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

function listenForEvents(app) {
    app.use("/slack/events", slack_events.requestListener())
}

slack_events.on('app_home_opened', async (event) => {
    console.log(`Received an app_mention event from user ${event.user} in channel ${event.channel}`);
    console.log(event);
    sampleMessage()
});

slack_events.on("app_mention", async (event) => {
    console.log(`Received an app_mention event from user ${event.user} in channel ${event.channel}`);
    console.log(event)

    const { channel: fromChannel, text: message } = event
    const { channel: toChannel, template: templateName } = messagePatternRecognize(message);

    console.log("toChannel", typeof toChannel, toChannel);
    console.log("templateId", typeof templateName, templateName);

    await customTemplateMessages(toChannel ?? process.env.DEFAULT_CHANNEL, templateName)
})


slack_events.on('error', (error) => {
    console.log(`error: ${error}`)
})



module.exports = { listenForEvents } 