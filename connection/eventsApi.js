const { LogLevel } = require('@slack/web-api');
const { App } = require('@slack/bolt');

const { sendMessage, customMessages } = require("./webApi")

const eventsClient = new App({
    token: process.env.BOT_USER_OAUTH_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: LogLevel.DEBUG
});

eventsClient.command("/knowledge", async ({ command, ack, say }) => {
    try {
        await ack();
        say("Yaaay! that command works!");
    } catch (error) {
        console.log("err")
        console.error(error);
    }
});


eventsClient.event('app_home_opened', async ({ event, say }) => {
    console.log(event)
    const slack_cli_test_bot = 'C04J39Y79LG';
    // sendMessage()
    customMessages(slack_cli_test_bot, "dinnerMessageTemplate")
    await say(`Custom message was sent!`);
});


eventsClient.event('message', async ({ event, say }) => {
    console.log(event)
    // sendMessage()
    await say(`Hey <@${event.user}>!. You send a message in a channel`);
});


eventsClient.event('app_mention', async ({ event, context, client, say }) => {
    try {

        console.log(event.type)
        console.log(context)
        console.log(client)

        await say({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Thanks for the mention <@${event.user}>! Here's a button`
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Button",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "action_id": "first_button"
                    }
                }
            ]
        });
    }
    catch (error) {
        console.error(error);
    }
});


module.exports = { eventsClient };


// (async () => {
//     const port = 3000
//     // Start your app
    // await eventsClient.start(process.env.PORT || port);
//     console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
// })();