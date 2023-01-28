import mongoose, { Schema } from 'mongoose';


export interface MessageTemplateModel {
    templateId: string;
    templateName: string;
    block: string;
}

export interface MessageTemplateDocument extends MessageTemplateModel, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const messageTemplateSchema = new Schema({
    templateId: {
        type: String,
        required: true
    },
    templateName: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
}, { timestamps: true })

export default mongoose.model<MessageTemplateDocument>('MessageTemplate', messageTemplateSchema);