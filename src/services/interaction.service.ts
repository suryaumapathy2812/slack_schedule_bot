import { View } from "../controller/interaction.controller";
import { Bot } from "../slack/bot";
import { CommonMessages } from "../slack/commonMessages";
import { Conversations } from "../slack/conversation";
import { SlackMessage } from "../slack/slackMessage";
import { PollService } from "./poll.service"
import { PollResponseService } from "./PollResponse.service";

export class InteractionService {


    async viewSubmission(payload: View.ViewSubmission) {

        try {

            console.log(payload)

            const user = {
                userId: payload.user.id,
                userName: payload.user.username
            }

            const { values } = payload.view.state

            const channels = Object.values(values.channels)[0];

            const selectedChannels = channels["selected_conversations"]
            const question = Object.values(values.questions)[0]["value"];
            const options = Object.values(values.options)[0]["value"]
                .split("\n")
                .map((val: string, i: number) => { return { text: val, value: i + 1 } });

            // const messageBlock = CommonMessages.generatePoll({ question, options }, { username: user.userName, status: true });

            const messageResp = []

            for (let i = 0; i < selectedChannels.length; i++) {

                const channelId = selectedChannels[i];
                const isPart = await new Conversations().isPart(channelId, process.env.BOT_ID ?? "")

                if (isPart) {
                    const resp = await new PollService().createPoll(
                        { question, options, channelId: channelId }, { user, status: true }
                    )
                    messageResp.push(resp)
                } else {
                    messageResp.push({ slack: { status: "failed", reason: "Bot not part of the Conversation" }, db: { status: "failed" } })
                }

            }

            console.log(messageResp)

            return { status: "SUCCESS", code: 200, messageResp };

        } catch (error) {

            console.log(error);
            return { status: "FAILED", code: 400, error }

        }

    }


    async pollResponse(payload: any) {

        try {

            const channelId = payload.channel.id;
            const ts = payload.message.ts;
            const userId = payload.user.id;
            const username = payload.user.username;
            const userResponse = payload.actions[0].value;

            const pollResponseService = new PollResponseService()
            const poll = await new PollService()
                .findOnePoll(
                    {
                        channelId,
                        ts
                    }
                )

            if (!poll) {
                console.log("Poll Not Found");
                throw new Error("Poll Not Found")
            }

            if (poll.active === false) {
                console.log("Poll is closed, Sorry !!!")
                console.log(poll)
            } else {

                console.log("Before Updating Message ============================", channelId, ts, userId, username, userResponse)

                const pollResponse = await pollResponseService
                    .findOneMessage(
                        {
                            channelId,
                            ts,
                            userId
                        }
                    )

                if (!pollResponse) {

                    const storeRecord = await pollResponseService
                        .createMessage(
                            {
                                channelId,
                                ts,
                                userId,
                                username,
                                userResponse,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        )

                    console.log(storeRecord)

                } else {

                    const response = await pollResponseService
                        .updateMessage(
                            {
                                channelId,
                                ts,
                                userId
                            },
                            {
                                channelId,
                                ts,
                                userId,
                                username,
                                userResponse
                            }
                        )

                    console.log(response);

                }

            }

            const question = poll.question;
            const options = poll.options;
            const responses = await pollResponseService.findAllResponses({
                channelId,
                ts,
            })

            const updatedMessageBlock = await CommonMessages
                .updatePoll({ question, options, responses }, { username, status: poll.active });

            const messsageUpdateResp = await new SlackMessage().updateMessage({
                channel: channelId,
                ts,
                text: question,
                blocks: updatedMessageBlock["blocks"]
            })

            return messsageUpdateResp


        } catch (error) {
            console.log(error)
            return error
        }

    }

    async closePoll(payload: any) {

        try {

            const { block_id } = payload.actions[0];
            const ts = JSON.parse(block_id)

            const pollService = new PollService()
            const closePoll = await pollService.closePoll({ ts: ts, active: true });

            const poll = await pollService.findOnePoll({ ts: ts })

            console.log(poll)

            if (!poll) {
                throw new Error("Poll not found")
            }

            const channelId: any = poll.channelId
            const question: any = poll.question
            const options: any = poll.options
            const user: any = poll.createdBy
            const status: any = poll.active


            console.log("========================================================")
            console.log(channelId, question, options, user, status)
            console.log("========================================================")

            const responses = await new PollResponseService().findAllResponses({
                ts,
            })

            const updatedMessageBlock = await CommonMessages.updatePoll(
                { question, options, responses }, { username: user.userName, status }
            );

            console.log(updatedMessageBlock)

            const messsageUpdateResp = await new SlackMessage().updateMessage({
                channel: channelId,
                ts,
                text: "This Poll is Closed",
                blocks: updatedMessageBlock["blocks"]
            })

            console.log(messsageUpdateResp)

        } catch (error) {
            console.log(error)
        }

    }


}