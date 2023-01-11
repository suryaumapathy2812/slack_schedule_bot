import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import Poll, { PollDocument } from "./../model/Poll.model"



export async function createPoll(input: PollDocument) {
    const poll = new Poll(input);
    const db_res = await poll.save();
    console.log("Data recorded", db_res);
    return db_res;
}


export async function findOnePoll(query: FilterQuery<PollDocument>, options: QueryOptions = {}) {
    return await Poll.findOne(query, null, options)
}


export async function updatePoll(filter: FilterQuery<PollDocument>, update: UpdateQuery<PollDocument>, options: QueryOptions = {}) {
    return await Poll.findOneAndUpdate(filter, update, options)
}