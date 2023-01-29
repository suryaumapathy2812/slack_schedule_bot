import { Request } from "express";
import { CommonMessages } from "../slack/commonMessages";
import { SlackMessage } from "../slack/slackMessage";
import { SlackModal } from "../slack/slackModal";

export class CommandService {


    async createPollModel(req: Request<any>) {
        try {

            const channelId = req.body["channel_id"];
            const triggerId = req.body["trigger_id"]


            const modelBlock = CommonMessages.createPollModel();
            console.log(modelBlock);

            const modelResp = await new SlackModal()
                .openModel({
                    triggerId,
                    view: modelBlock
                })

            return modelResp;

        } catch (error) {
            console.log(error);
        }
    }

    async dinnerMessage(req: Request<any>) {

        try {

            const channelId = req.body["channel_id"];
            const senderId = req.body["user_name"];

            const messageBlock = CommonMessages.dinnerMessage({
                channelId,
                senderId: senderId,
                text: "dinner_message",
                status: "OPEN"
            });

            const messageResp = await new SlackMessage()
                .sendMessage(
                    Object.assign(messageBlock, {
                        channelId: channelId,
                        text: "Dinner Message",
                    }),
                    { type: "BLOCK" }
                );

            return messageResp

        } catch (error) {
            console.log(error)
        }
    }


}