import { WebClient } from "@slack/client";
import { LogLevel } from "@slack/logger";

class SlackMessage {

    private web: WebClient;

    constructor() {
        this.web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
            logLevel: LogLevel.DEBUG
        })
    }


    async sendMessage(text: String) {

    }






}