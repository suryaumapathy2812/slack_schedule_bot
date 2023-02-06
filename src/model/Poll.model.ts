import mongoose, { Schema } from 'mongoose';

export interface User {
    userId: string;
    userName: string;
}


export interface PollModel {

    channelId: string;
    ts: string;
    active: boolean;
    createdBy: User;
    modifiedBy: User;

    question: string;
    options: {
        text: string;
        value: number;
    }[];

}

export interface PollDocument extends PollModel {
    createdAt: Date;
    updatedAt: Date;
}


const pollSchema = new Schema({
    channelId: {
        type: String,
        required: true
    },
    ts: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [{
            text: { type: String, required: true },
            value: { type: Number, required: true }
        }],
        required: true
    },

    active: {
        type: Boolean,
        required: true,
        default: true
    },
    createdBy: {
        type: {
            userId: { type: String, required: true },
            userName: { type: String, required: true }
        },
        required: true
    },
    modifiedBy: {
        type: {
            userId: { type: String, required: true },
            userName: { type: String, required: true }
        },
        required: true
    }

}, { timestamps: true })

export default mongoose.model<PollDocument>('Poll', pollSchema);

