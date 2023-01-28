// import { slackInteraction } from "./../connections/slackConn"

import { createMessageAdapter } from "@slack/interactive-messages";

const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)
const slackInteraction = createMessageAdapter(signing_secret);

slackInteraction
    .action({ type: 'button' }, async (payload, response) => {
        try {
            console.log(payload);

            const channelId = payload.channel.id;
            const ts = payload.message.ts;
            const userId = payload.user.id;
            const username = payload.user.username;
            const userResponse = payload.actions[0].value;

            console.log(channelId, ts, userId, username, userResponse);


        } catch (error) {
            console.log(error)
        }

    })


export { slackInteraction }