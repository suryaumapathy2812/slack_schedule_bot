import { Request } from "express";
import { CommonMessages } from "../slack/commonMessages";
import { SlackMessage } from "../slack/slackMessage";

export class CommandService {

    async dinnerMessage(req: Request<any>) {

        try {

            const channelId = req.body["channel_id"];

            const messageBlock = CommonMessages.dinnerMessage({
                channelId,
                text: "dinner_message",
                status: "OPEN"
            });

            const messageResp = await new SlackMessage()
                .sendMessage(
                    {
                        channel: channelId,
                        text: "Dinner Message",
                        blocks: messageBlock["blocks"]
                    },
                    { type: "BLOCK" }
                );

            return messageResp

        } catch (error) {
            console.log(error)
        }
    }


}