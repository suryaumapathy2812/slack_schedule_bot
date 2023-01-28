import express from "express";
import { SlackMessage } from "../slack/slackMessage";

const commandController = express.Router();

commandController.post("/dinner_message", async (req, res) => {
    try {
        console.log("dinner_message ========================");
        console.log(req.body)

        const channelId = req.body["channel_id"];

        const messageBlock = dinnerMessage({
            channelId,
            text: "dinner_message",
            status: "OPEN"
        });

        const messageResp = await new SlackMessage()
            .sendMessage(
                {
                    channel: channelId,
                    text: "Dinner Message",
                    blocks: messageBlock["blocks"]
                },
                { type: "BLOCK" }
            );

        console.log(messageResp);
        res.send("Request Completed");

    } catch (error) {

    }
})


export { commandController };


import { Message, Blocks, Elements, Md, MessageBuilder } from 'slack-block-builder';

interface arg {
    channelId: string;
    text: string;
    status: string;
}

const arg = {
    channelId: "",
    text: "",
    status: "OPEN"
}

function dinnerMessage(arg: arg): { blocks: any[] } {

    const message: string = Message()
        .blocks(

            Blocks.Section({ text: `@channel \n\n` }),
            Blocks.Section({ text: `${Md.bold("Are you staying back for dinner :knife_fork_plate: tonight?")} \n` }),
            Blocks.Section({ text: `This Poll is currently ${Md.bold(arg.status)} \n` }),

            Blocks.Section({ text: `${Md.bold("YES")}` })
                .accessory(
                    Elements.Button({ text: "YES", value: "YES", accessibilityLabel: "YES" })
                        .primary(),
                ),
            Blocks.Section({ text: `${Md.bold("NO")}` })
                .accessory(
                    Elements.Button({ text: "NO", value: "NO", accessibilityLabel: "NO" })
                        .danger(),
                )

        )
        .buildToJSON()

    return JSON.parse(message);

}

// const block = dinnerMessage({
//     channelId: "",
//     status: "OPEN",
//     text: "hello world"
// });

// console.log(typeof block)
// console.log(JSON.parse(block))