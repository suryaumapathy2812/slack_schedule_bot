import { WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";

export class Bot {

    private web: WebClient;
    private id: string;

    constructor() {
        this.web = slackWeb
        this.id = process.env.BOT_ID ?? ""
    }

    async info() {
        return await this.web.bots.info({ bot: this.id })
    }

}

