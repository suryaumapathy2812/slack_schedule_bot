import { WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";

export class Conversations {

    private web: WebClient;

    constructor() {
        this.web = slackWeb;
    }

    async members(channelId: string) {
        console.log(await this.web.conversations.info({ channel: channelId }))
        return this.web.conversations.members({ channel: channelId })
    }

    async isPart(channelId: string, userId: string) {
        try {
            console.log(channelId, userId);
            // const conversationMembers = await this.members(channelId);
            const conversationMembers = await this.members(channelId);
            console.log(conversationMembers);
            return true;
        } catch (error) {
            console.log(error);
            return false
        }

    }

}