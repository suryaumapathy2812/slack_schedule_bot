const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const pollMessageHistory = new Schema({
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

const PollMessageHistoryModel = mongoose.model('PollMessageHistory', pollMessageHistory);
module.exports = PollMessageHistoryModel