import { Request } from "express";
import { Md } from "slack-block-builder";
import { CommonMessages } from "../slack/commonMessages";
import { SlackModal } from "../slack/slackModal";
import { PollService } from "./poll.service";

export class CommandService {


    async createPollModel(req: Request<any>) {
        try {

            const channelId = req.body["channel_id"];
            const triggerId = req.body["trigger_id"]

            console.log(channelId, triggerId);

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

            const user = {
                userId: req.body["user_id"],
                userName: req.body["user_name"]
            }

            const data = {
                channelId: req.body["channel_id"],
                question: `${Md.bold("Are you staying back for dinner tonight?")}`,
                options: [
                    { text: "YES", value: 1 },
                    { text: "NO", value: 2 },
                ]
            }

            const messageResp = new PollService()
                .createPoll(
                    data, { user, status: true }
                )

            return messageResp

        } catch (error) {
            console.log(error)
        }
    }


}