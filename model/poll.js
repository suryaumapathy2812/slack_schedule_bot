const mongoose = require("mongoose");
const { updateMessageTemplate } = require("../common/utils");
const SlackMessage = require("../templates/slackMessage");
const Schema = mongoose.Schema;


const pollSchema = new Schema({
    channelId: {
        type: String,
        required: true
    },
    messageId: {
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

const Poll = mongoose.model('Poll', pollSchema);



module.exports = Poll;