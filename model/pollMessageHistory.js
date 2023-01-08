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
    }
}, { timestamps: true })

const PollMessageHistory = mongoose.model('PollMessageHistory', pollMessageHistory);
module.exports = PollMessageHistory