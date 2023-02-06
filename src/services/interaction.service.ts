
import { AnyKindOfDictionary } from "lodash";
import { View } from "../controller/interaction.controller";
import { CommonMessages } from "../slack/commonMessages";
import { SlackMessage } from "../slack/slackMessage";
import { PollService } from "./poll.service"
import { PollResponseService } from "./PollResponse.service";

export class InteractionService {


    async viewSubmission(payload: View.ViewSubmission) {

        try {

            const user = {
                userId: payload.user.id,
                userName: payload.user.username
            }

            const view = payload.view
            const values = view.state.values

            const channels = Object.values(values.channels)[0];

            const selectedChannels = channels["selected_channels"]
            const question = Object.values(values.questions)[0]["value"];
            const options = Object.values(values.options)[0]["value"]
                .split("\n")
                .map((val: string, i: number) => { return { text: val, value: i + 1 } });

            // const messageBlock = CommonMessages.generatePoll({ question, options }, { username: user.userName, status: true });

            const messageResp = []

            for (let i = 0; i < selectedChannels.length; i++) {

                const resp = await new PollService().createPoll(
                    { question, options, channelId: selectedChannels[i] }, { user, status: true }
                )

                console.log(resp)

                messageResp.push(resp)

            }

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
                return poll;
            } else {

                const pollResponseService = new PollResponseService()

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
                    text: "",
                    blocks: updatedMessageBlock["blocks"]
                })

                return messsageUpdateResp

            }

        } catch (error) {
            console.log(error)
        }

    }


}