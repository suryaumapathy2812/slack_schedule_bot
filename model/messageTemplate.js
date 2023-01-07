const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    }
}, { timestamps: true })

const MessageTemplate = mongoose.model('MessageTemplate', messageTemplateSchema);
module.exports = MessageTemplate;