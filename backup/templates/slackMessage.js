const { WebClient } = require("@slack/client");
const { LogLevel } = require("@slack/web-api");
const { updateMessageTemplate } = require("../common/utils");
const MessageTemplate = require("../model/messageTemplateModel");


class SlackMessage {

    web;


    constructor() {
        this.web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
            logLevel: LogLevel.DEBUG
        });
    }


    async sampleMessage() {
        try {

            const res = await this.web.chat.postMessage({
                channel: process.env.DEFAULT_CHANNEL,
                text: 'Hello, world!'
            })

            console.log("SlackMessage.sampleMessage() success ====================")
            console.log(res.ts);

        } catch (error) {
            console.log("SlackMessage.sampleMessage() failed ====================")
            console.log(error)
        }
    }


    async sendMessage(channelId, message) {
        try {

            const res = await this.web.chat.postMessage({
                channel: channelId,
                text: message
            })
            console.log("SlackMessage.sendMessage() success ====================")
            console.log(res.ts);

        } catch (error) {
            console.log("SlackMessage.sendMessage() failed ====================")
            console.log(error)
        }
    }


    async updateMessage(channelId, ts, message) {

        try {

            const res = await this.web.chat.update({
                channel: channelId,
                ts: ts,
                text: message
            })

            console.log("SlackMessage.updateMessage() success ====================")
            console.log(res);

        } catch (error) {
            console.log("SlackMessage.updateMessage() failed ====================")
            console.log(error);
        }


    }


    async sendRichMessage(channelId, templateName) {
        try {

            const messageBlock = await MessageTemplate.findOne({ templateName });

            console.log("MessageTemplate.findOne success ====================")
            console.log(messageBlock)


            const block = updateMessageTemplate(messageBlock.block);
            // const block = JSON.parse(messageBlock.block)
            console.log("block ===================")
            console.log(typeof block)

            const res = await this.web.chat.postMessage({
                channel: channelId,
                blocks: block
            })
            console.log("SlackMessage.sendRichMessage() success ====================")
            console.log(res);

            return { status: "success", res, templateId: messageBlock.templateId };

        } catch (error) {
            console.log("SlackMessage.sendRichMessage() failed ====================")
            console.log(error)
            return { status: "failed" }
        }
    }


    async updateRichMessage(channelId, templateName, ts, { userId, username, userResponse }) {
        try {

            const messageBlock = await MessageTemplate.findOne({ templateName })

            console.log("MessageTemplate.findOne() success ====================")
            console.log(messageBlock)

            const block = updateMessageTemplate(messageBlock.block);
            console.log("block ===================")
            console.log(typeof block)

            const res = await this.web.chat.update({
                channel: channelId,
                ts: ts,
                blocks: block
            })

            console.log("SlackMessage.updateRichMessage() success ====================")
            console.log(res);

        } catch (error) {
            console.log("SlackMessage.updateRichMessage() failed ====================")
            console.log(res);
        }
    }


    async scheduleMessage(channelId, time, message) {
        try {

            const res = await this.web.chat.scheduleMessage({
                channelId: channelId,
                text: message,
                post_at: time
            });

            console.log("SlackMessage.scheduleMessage() success ====================")
            console.log(res.ts)

        } catch (error) {
            console.log("SlackMessage.scheduleMessage() failed ====================")
            console.log(error)
        }
    }


    async scheduleRichMessage(channelId, time, templateName) {
        try {

            const messageBlock = new MessageTemplate.findOne({ templateName })

            console.log("MessageTemplate.findOne success ====================")
            console.log(messageTemplate)

            const res = await this.web.chat.scheduleRichMessage({
                channelId: channelId,
                post_at: time,
                blocks: JSON.parse(messageBlock)
            });

            console.log("SlackMessage.scheduleMessage() success ====================")
            console.log(res.ts)

        } catch (error) {
            console.log("SlackMessage.scheduleMessage() failed ====================")
            console.log(error)
        }
    }


}

module.exports = SlackMessage