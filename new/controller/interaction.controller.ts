import { slackInteraction } from "./../connections/slackConn"

function listenForInteraction(app: any) {
    app.use('/slack/interactions', slackInteraction.requestListener())
}