import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MessageTemplate, { MessageTemplateDocument } from "./../model/MessageTemplate.model"


export async function createMessage(input: MessageTemplateDocument) {
    const poll = new MessageTemplate(input);
    const db_res = await poll.save();
    console.log("Data recorded", db_res);
    return db_res;
}


export async function findOneMessage(query: FilterQuery<MessageTemplateDocument>, options: QueryOptions = {}) {
    return await MessageTemplate.findOne(query, null, options)
}


export async function updateMessage(filter: FilterQuery<MessageTemplateDocument>, update: UpdateQuery<MessageTemplateDocument>, options: QueryOptions = {}) {
    return await MessageTemplate.findOneAndUpdate(filter, update, options)
}
