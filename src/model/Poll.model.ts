import mongoose, { Schema } from 'mongoose';

export interface PollModel {

    templateId: string;
    channelId: string;
    ts: string;
    active: boolean;
}

export interface PollDocument extends PollModel, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}


const pollSchema = new Schema({
    templateId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    ts: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })

export default mongoose.model<PollDocument>('Poll', pollSchema);

