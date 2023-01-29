import mongoose, { Schema } from "mongoose";


export interface PollResponseModel {
    channelId: string;
    ts: string;
    userId: string;
    username: string;
    userResponse: number;
}

export interface PollResponseDocument extends PollResponseModel {
    createdAt: Date;
    updatedAt: Date;
}

const pollResponseSchema = new Schema({
    channelId: {
        type: String,
        required: true
    },
    ts: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    userResponse: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model<PollResponseDocument>('PollResponse', pollResponseSchema);