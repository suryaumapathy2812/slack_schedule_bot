import { Block, ChatPostMessageArguments, ChatUpdateArguments, KnownBlock, WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";


const default_message = "Hi! This is Zork_dev, looks like someone has forgoten something"

export interface Message extends ChatPostMessageArguments {
    channel: string;
    text: string;
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


    async sendMessage(message: Message, options?: MessageOptions): Promise<any> {
        try {

            const messageObj: ChatPostMessageArguments = Object.assign({}, message)

            console.log(messageObj);

            // if (options?.type === "BLOCK") messageObj.blocks = message.blocks

            const res = await this.web.chat.postMessage(messageObj)

            console.log("SlackMessage.sendMessage() success ====================")
            console.log(res.ts);

            return res;

        } catch (error) {
            console.log("SlackMessage.sendMessage() failed  ====================")
            console.log(error)
        }
    }


    async updateMessage(message: UpdatedMessage, options?: MessageOptions) {
        try {

            // const messageObj: ChatUpdateArguments = {
            //     channel: message.channel,
            //     ts: message.ts,
            //     text: message.text ?? default_message,
            // }
            console.log("SlackMessage.updateMessage() Entered ====================")
            console.log(message)

            const res = await this.web.chat.update(message)

            console.log("SlackMessage.updateMessage() success ====================")
            console.log(res.ts);

            return res

        } catch (error) {
            console.log("SlackMessage.updateMessage() failed ====================")
            console.log(error);
        }
    }


}