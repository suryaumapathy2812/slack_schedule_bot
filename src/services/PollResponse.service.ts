import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import PollResponse, { PollResponseDocument } from "./../model/PollResponse.model"


export class PollResponseService {

    async createMessage(input: PollResponseDocument) {
        const poll = new PollResponse(input);
        const db_res = await poll.save();
        console.log("Data recorded", db_res);
        return db_res;
    }

    async findAllResponses(query: FilterQuery<PollResponseDocument>, options: QueryOptions = {}) {
        return await PollResponse.find(query, null, options);
    }

    async findOneMessage(query: FilterQuery<PollResponseDocument>, options: QueryOptions = {}) {
        return await PollResponse.findOne(query, null, options)
    }


    async updateMessage(filter: FilterQuery<PollResponseDocument>, update: UpdateQuery<PollResponseDocument>, options: QueryOptions = {}) {
        return await PollResponse.findOneAndUpdate(filter, update, options)
    }

}
