import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import Poll, { PollDocument } from "../model/Poll.model"
import { CommonMessages } from "../slack/commonMessages";
import { SlackMessage } from "../slack/slackMessage";


export class PollService {

    // async createPoll({ question, options, channelId }, { username, status }) {
    async createPoll(data: { question: string, options: { text: string, value: number }[], channelId: string }, optional: { user: { userId: string, userName: string }, status: boolean }) {

        try {

            console.log(data, optional)

            const { channelId, question, options } = data
            const { user, status } = optional

            const messageBlock = CommonMessages.generatePoll({ question, options }, { username: user.userName, status: true });

            const resp = await new SlackMessage()
                .sendMessage(
                    Object.assign(messageBlock, {
                        channel: channelId,
                        text: "Dinner Message"
                    }),
                    { type: "BLOCK" });

            const pollinput = {
                channelId: channelId,
                question: question,
                options: options.map((opt) => { return { "text": opt.text, "value": opt.value }; }),
                active: true,
                createdBy: user,
                modifiedBy: user,
                ts: resp["ts"],
                createdAt: new Date(),
                updatedAt: new Date()
            }

            console.log(pollinput)

            const poll = new Poll(pollinput);
            const db_res = await poll.save();
            console.log("Data recorded", db_res);
            return { slack: resp, db: db_res };

        } catch (error) {

            console.log(error)
            return { slack: { status: "falied" }, db: { status: "failed" } }

        }


    }

    async findOnePoll(query: FilterQuery<PollDocument>, options: QueryOptions = {}) {
        return await Poll.findOne(query, null, options)
    }

    async updatePoll(filter: FilterQuery<PollDocument>, update: UpdateQuery<PollDocument>, options: QueryOptions = {}) {
        return await Poll.findOneAndUpdate(filter, update, options)
    }

    async closePoll(filter: FilterQuery<PollDocument>, options: QueryOptions = {}) {
        return await Poll.findOneAndUpdate(filter, { active: false }, options)
    }


    async findAllPolls(filter: FilterQuery<PollDocument> = {}, options: QueryOptions = {}) {
        const filterCondition = Object.assign({ active: true, filter })
        return await Poll.find(filterCondition, options);
    }

    // ! User poles

    async findAllUserPolls(filter: FilterQuery<PollDocument>, options: QueryOptions = {}) {
        return await Poll.find(filter, options);
    }


    async findAllActiveUserPolls(filter: FilterQuery<PollDocument>, options: QueryOptions = {}) {
        const filterCondition = Object.assign({ active: true, filter })
        return await Poll.find(filterCondition, options);
    }



}
