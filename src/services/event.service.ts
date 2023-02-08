import { PollDocument } from "../model/Poll.model"
import { CommonMessages } from "../slack/commonMessages";
import { SlackMessage } from "../slack/slackMessage";
import { SlackModal } from "../slack/slackModal";
import { PollService } from "./poll.service"
import { PollResponseService } from "./PollResponse.service";

export class EventService {


    async appHomeMention(userId: string, channel: string) {


        const filter = {
            createdBy: {
                userId: userId
            }
        }

        const userPolls = await new PollService()
            .findAllPolls(filter);

        // const polls = userPolls.map(async (poll) => {
        //     const responses = await new PollResponseService()
        //         .findAllResponses({ ts: poll.ts, channelId: channel })
        // })

        console.log(userPolls)

        const blocks: { blocks: any[] } = await CommonMessages.app_home_mention(userPolls);

        const viewObj = {
            type: "home",
            title: {
                type: 'plain_text',
                text: 'My Polls'
            },
            ...blocks,

        }

        console.log(viewObj);

        const res = await new SlackModal().slackView({ view: viewObj, user: userId })
        console.log(res)

    }

}