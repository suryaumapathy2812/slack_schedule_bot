import { PollDocument } from "../model/Poll.model"
import { CommonMessages } from "../slack/commonMessages";
import { SlackMessage } from "../slack/slackMessage";
import { SlackModal } from "../slack/slackModal";
import { User } from "../slack/user";
import { PollService } from "./poll.service"
import { PollResponseService } from "./PollResponse.service";

export class EventService {


    async appHomeMention(userId: string, channel: string) {


        const filter = {
            createdBy: {
                userId: userId
            }
        }

        const userName = await new User().getName(userId)

        const viewLoadingObj = {
            type: "home",
            title: {
                type: 'plain_text',
                text: 'My Polls'
            },
            blocks: (await CommonMessages.app_home_mention_loading(userName)).blocks
        }

        console.log(viewLoadingObj);
        const loadingViewRes = await new SlackModal().slackView({ view: viewLoadingObj, user: userId })
        console.log(loadingViewRes);

        const userPolls = (await new PollService()
            .findAllPolls(filter))
        // console.log(userPolls)

        // const polls = userPolls.map(async (poll) => {
        //     const responses = await new PollResponseService()
        //         .findAllResponses({ ts: poll.ts, channelId: channel })
        // })

        const blocks: { blocks: any[] } = await CommonMessages.app_home_mention(userName, userPolls);

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