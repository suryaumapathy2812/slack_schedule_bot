import { WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";

export class User {
    private web: WebClient;

    constructor() {
        this.web = slackWeb;
    }

    async getName(userId: string) {
        const details: any = await this.web.users.info({ user: userId });
        return details.user?.name
    }

}