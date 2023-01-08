const { WebClient, LogLevel } = require('@slack/web-api');
const Poll = require('../model/poll');
const SlackMessage = require('../templates/slackMessage');
const { templates } = require("../templates/templates");



// Replace the placeholders with your Slack bot's access token and the channel ID

const slackMessage = new SlackMessage();


const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
    logLevel: LogLevel.DEBUG
});

async function sampleMessage() {
    // Call the chat.postMessage method using the WebClient
    try {
        await slackMessage.sampleMessage();
    } catch (error) {
        console.log(error)
    }
}

async function scheduledMessage() {
    const timeInSeconds = 60; // time in seconds from now

    try {
        await slackMessage.scheduleMessage(
            process.env.DEFAULT_CHANNEL,
            Math.floor(Date.now() / 1000) + timeInSeconds,
            'This is a scheduled message. Initiated at ' + Date.now()
        )
    } catch (error) {
        console.log(error)
    }
}

async function scheduledMessageList() {
    await web.chat.scheduledMessages.list({ channel: process.env.DEFAULT_CHANNEL })
        .then((res) => {
            for (const message of res.scheduled_messages) {
                console.log(message);
            }
        }).catch(console.error);
}

async function customMessage(channelId, message) {
    // Call the chat.postMessage method using the WebClient
    try {

        await slackMessage.sendMessage(
            channelId ?? process.env.DEFAULT_CHANNEL,
            message ?? "Someone tried using @Zork"
        );

    } catch (error) {
        console.log(error)
    }
}

async function customTemplateMessages(channelId, messageTemplate) {

    try {

        const res = await slackMessage.sendRichMessage(channelId, messageTemplate);
        // return res;

    } catch (error) {
        console.log(error)
    }


}

async function updateSimpleMessage({ channelId, ts, userId, username, userResponse }) {
    try {
        console.log("Before Updating Message ============================", channelId, ts, userId, username, userResponse)

        const isExist = await Poll.findOne({ channelId, messageId: ts, userId });
        console.log("Data isExist", isExist);


        if (!isExist) {

            const poll = new Poll({
                channelId: channelId,
                messageId: ts,
                userId: userId,
                username: username,
                userResponse: userResponse
            })

            const db_res = await poll.save();
            console.log("Data recorded", db_res);

        } else {
            console.log("isExist ========", isExist)

            const updateResponse = await Poll.findOneAndUpdate({
                channelId: isExist.channelId,
                messageId: isExist.messageId,
                userId: isExist.userId
            }, {
                channelId,
                ts,
                userId,
                username,
                userResponse
            }, { new: true })
            console.log("updateResponse", updateResponse)
        }

        const responseList = await Poll.find({ channelId, messageId: ts, userId });
        console.log("Data retrieved", responseList);

        const newDinnerMessageTemplate = templates.dinnerMessageTemplate(responseList)

        const res = await web.chat.update({
            channel: channelId,
            ts: ts,
            // text: "*Message has been modified Successfully*",
            as_user: true,
            blocks: newDinnerMessageTemplate
        })
        console.log('Message updated: ==============================', res)

    } catch (error) {
        console.log(error)
    }
}



module.exports = { sampleMessage, scheduledMessage, customTemplateMessages, customMessage, updateSimpleMessage }