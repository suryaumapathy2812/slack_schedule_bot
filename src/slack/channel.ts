import { WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";

export class Channel {

    private web: WebClient;

    constructor() {
        this.web = slackWeb;
    }


    async getName(channelId: string) {
        const details: any = await this.web.conversations.info({ channel: channelId });
        return details.channel?.name
    }


    async details(channelId: string) {
        return await this.web.conversations.info({ channel: channelId })
    }

}