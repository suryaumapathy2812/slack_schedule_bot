import { Block, ChatPostMessageArguments, ChatUpdateArguments, KnownBlock, WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";
import { Message, Blocks, Elements, Md } from 'slack-block-builder';

const default_message = "Hi! This is Zork_dev, looks like someone has forgoten something"

export interface Message {
    channel: string;
    text?: string;
    blocks?: (Block | KnownBlock)[];
}


export interface UpdatedMessage extends Message {
    ts: string;
}

export interface MessageOptions {
    type: "TEXT" | "BLOCK";
}


export class SlackMessage {

    private web: WebClient;

    constructor() {
        this.web = slackWeb
    }


    async sendMessage(message: Message, options?: MessageOptions) {
        try {

            const messageObj: ChatPostMessageArguments = {
                channel: message.channel,
                text: message.text ?? default_message,
            }

            if (options?.type === "BLOCK") messageObj.blocks = message.blocks

            const res = await this.web.chat.postMessage(messageObj)

            console.log("SlackMessage.sendMessage() success ====================")
            console.log(res.ts);

        } catch (error) {
            console.log("SlackMessage.sendMessage() failed  ====================")
            console.log(error)
        }
    }


    async updateMessage(message: Message, update: UpdatedMessage, options?: MessageOptions) {
        try {

            const messageObj: ChatUpdateArguments = {
                channel: message.channel,
                ts: update.ts,
                text: message.text ?? default_message,
            }

            const res = await this.web.chat.update(messageObj)

            console.log("SlackMessage.updateMessage() success ====================")
            console.log(res.ts);

        } catch (error) {
            console.log("SlackMessage.updateMessage() failed ====================")
            console.log(error);
        }
    }


}