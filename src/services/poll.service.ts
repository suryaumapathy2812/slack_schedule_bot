import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import Poll, { PollDocument } from "../model/Poll.model"


export class PollService {

    async createPoll(input: PollDocument) {
        const poll = new Poll(input);
        const db_res = await poll.save();
        console.log("Data recorded", db_res);
        return db_res;
    }

    async findOnePoll(query: FilterQuery<PollDocument>, options: QueryOptions = {}) {
        return await Poll.findOne(query, null, options)
    }


    async updatePoll(filter: FilterQuery<PollDocument>, update: UpdateQuery<PollDocument>, options: QueryOptions = {}) {
        return await Poll.findOneAndUpdate(filter, update, options)
    }


}
