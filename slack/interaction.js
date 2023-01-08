const { createMessageAdapter } = require("@slack/interactive-messages");
const PollMessageHistory = require("../model/pollMessageHistory");
const PollMessage = require("../templates/pollMessage");

const slackInteraction = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);


function listenForInteraction(app) {
    app.use('/slack/interactions', slackInteraction.requestListener())
}



const { updateSimpleMessage } = require("./../connection/webApi")

slackInteraction.action({ type: 'button' }, async (payload, response) => {
    try {
        console.log(payload);

        const channelId = payload.channel.id;
        const ts = payload.message.ts;
        const userId = payload.user.id;
        const username = payload.user.username;
        const userResponse = payload.actions[0].value;


        console.log(channelId, ts, userId, username, userResponse);

        const pollMessageHistory = await PollMessageHistory.findOne({ channelId, ts });
        const { templateId } = pollMessageHistory;

        await new PollMessage().updateMessage(channelId, templateId, ts, { userId, username, userResponse })

        // await updateSimpleMessage({ channelId, ts, userId, username, userResponse })
        console.log("Message has been updated")

    } catch (error) {
        console.log(error)
    }

})


module.exports = { listenForInteraction }