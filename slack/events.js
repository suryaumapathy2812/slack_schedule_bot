const { createEventAdapter } = require("@slack/events-api");
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
    // customMessage(process.env.DEFAULT_CHANNEL, `Hi there ${event.user}, What can I do for you today?`)
    customTemplateMessages(process.env.DEFAULT_CHANNEL, "dinnerMessageTemplate")
    // await say(`Hi there ${event.user}, What can I do for you today`)
})


slack_events.on('error', (error) => {
    console.log(`error: ${error}`)
})



module.exports = { listenForEvents } 