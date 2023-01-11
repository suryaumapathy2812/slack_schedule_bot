import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MessageTemplate, { MessageTemplateDocument } from "./../model/MessageTemplate.model"


export async function create(input: Object) {
    return await MessageTemplate.create(input);
}


export async function findOne(query: FilterQuery<MessageTemplateDocument>, options: QueryOptions) {
    return await MessageTemplate.findOne(query, null, options)
}


export async function update(filter: FilterQuery<MessageTemplateDocument>, update: UpdateQuery<MessageTemplateDocument>, options: QueryOptions) {
    return await MessageTemplate.findOneAndUpdate(filter, update, options)
}