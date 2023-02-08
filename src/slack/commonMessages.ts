import { Message, Blocks, Elements, Md, Modal, Button } from 'slack-block-builder';
import { PollDocument } from '../model/Poll.model';
import { PollResponseDocument } from '../model/PollResponse.model';
import { ProgressBar } from '../utils/progressBar';
import { Channel } from './channel';

export interface DinnerMessageArgs {
    status: "OPEN" | "CLOSE";
    senderId: string;
    channelId?: string;
    text?: string;
}


export class CommonMessages {

    static createPollModel() {
        const model: string = Modal()
            .title("Zork")
            .submit("Submit")
            .close("Cancel")
            .blocks(
                Blocks.Header()
                    .text("Let's start creating your poll"),

                Blocks.Input()
                    .blockId("channels")
                    .label("Channel(s)")
                    .optional(false)
                    .element(
                        Elements.ConversationMultiSelect()
                            .maxSelectedItems(5)
                            .focusOnLoad(true)
                            .placeholder("Where should the poll be sent?"),
                    ),

                Blocks.Context()
                    .elements(
                        `*Note*: Integrate ${Md.bold("Zork")} in the above channels before sending the Poll, else you will not be receving the Polls`
                    ),

                Blocks.Input()
                    .blockId("questions")
                    .label("Question")
                    .optional(false)
                    .element(
                        Elements.TextInput()
                            .placeholder("Write your question...")
                            .multiline(false)
                            .maxLength(1000)
                    ),

                Blocks.Input()
                    .blockId("options")
                    .label("Enter your option(s) below")
                    .optional(false)
                    .element(
                        Elements.TextInput()
                            .placeholder("Write each option on a seperate line")
                            .multiline(true)
                            .maxLength(1000)
                    ),




            )
            .buildToJSON()

        return JSON.parse(model);
    }


    static generatePoll(data: { question: string, options: { text: string; value: number; }[] }, optional: { username: string, status: boolean }) {

        const { question, options } = data
        const { username, status } = optional

        const optionButtons = options.map((option) => {
            return Elements.Button()
                .value(`${option.value}`)
                .text(`${option.text}`)
        })

        const optionBlock = options.map((option) => {
            return Blocks.Section()
                .text(`*${option.value}.* ${option.text} `)
        })

        const poll = Message()
            .blocks(
                Blocks.Section({ text: `@channel \n` }),
                Blocks.Section()
                    .text(question),
                Blocks.Actions()
                    .elements(
                        ...optionButtons
                    ),
                // ...optionBlock,
                Blocks.Divider(),
                Blocks.Context()
                    .elements(
                        [
                            `Sender: ${username} `,
                            `| `,
                            `Poll status: ${status ? "open" : "closed"} `
                        ]
                    )
            )
            .buildToJSON()

        return JSON.parse(poll)

    }


    static updatePoll(data: { question: string, options: { text: string; value: number; }[], responses: any[] }, optional: { username: string, status: boolean }) {

        console.log("=========================================================================")
        console.log(data, optional)

        const { question, options, responses } = data;
        const { username, status } = optional

        const totalResponses = responses.length;
        console.log(totalResponses)

        const optionBlock = options.map((option) => {
            const resp = responses.filter(res => (+res.userResponse) === (option.value));

            const users = resp.map(r => `@${r.username} `).toString();

            return (` 
                ${option.text} \n\n${Md.codeInline(ProgressBar.generateProgressBar(resp.length))} | ${Math.round(resp.length / totalResponses * 100)} (${resp.length}) \n\n${users}
                `)
        })

        let optionButtons;

        console.log(status)

        if (status) {

            optionButtons = Blocks.Actions()
                .elements(
                    ...options.map((option) => {
                        return Elements.Button()
                            .value(`${option.value}`)
                            .text(`${option.text}`)
                    })
                )

            console.log(optionButtons)

        } else {
            optionButtons = Blocks.Divider()
            console.log(optionButtons)
        }

        const poll = Message()
            .blocks(
                Blocks.Section({ text: `@channel \n` }),
                Blocks.Section()
                    .text(question),
                optionButtons,
                Blocks.Section()
                    .fields(
                        ...optionBlock
                    ),
                Blocks.Divider(),
                Blocks.Context()
                    .elements(
                        [
                            `Sender: ${username} `,
                            `| `,
                            `Poll status: ${status ? "open" : "closed"} `,
                            `| `,
                            `Reponses: ${totalResponses}`
                        ]
                    )
            )
            .buildToJSON()

        return JSON.parse(poll)
    }


    static dinnerMessage(args: DinnerMessageArgs) {
        const message: string = Message()
            .blocks(

                Blocks.Section({ text: `@channel \n` }),
                Blocks.Section({ text: `${Md.bold("Are you staying back for dinner :knife_fork_plate: tonight?")} \n` }),
                Blocks.Divider(),
                Blocks.Section()
                    .text("YES")
                    .accessory(
                        Elements.Button()
                            .text("YES")
                            .primary()
                    ),

                Blocks.Section()
                    .text("NO")
                    .accessory(
                        Elements.Button()
                            .text("NO")
                            .danger()
                    ),
                Blocks.Divider(),

                Blocks.Context()
                    .elements(
                        [
                            `Sender: ${args.senderId} `,
                            `| `,
                            `Poll status: ${args.status.toLowerCase()} `
                        ]
                    )
            )
            .buildToJSON()

        return JSON.parse(message);
    }


    static async app_home_mention(polls: PollDocument[]) {

        const pollBlock = async (poll: PollDocument, pollResponses?: PollResponseDocument[]) => {

            const { channelId, active, createdBy } = poll;
            const { question, options } = poll

            const optionsString = options.map(_opt => `${Md.bold(_opt.text)}`).toString().replace(",", " \n")

            const channelName = await new Channel().getName(channelId)

            const section = Blocks.Section()
                .text(`*#${channelName}*\n ${question} \n\n ${optionsString}`)
                .accessory(
                    Elements.Button()
                        .text("Close Poll")
                        .value("close_poll")
                        .danger()
                )

            const context = Blocks.Context()
                .elements([
                    `Sender : ${createdBy.userName}`,
                    `|`,
                    `status : ${active ? "open" : "closed"}`,
                    `|`,
                    `Responses : `
                ])

            const divider = Blocks.Divider()

            return [section, context, divider]

        }

        const _pollBlockList = polls.map(async (poll) => await pollBlock(poll))

        const pollBlockList: any[] = await Promise.all(_pollBlockList);

        console.log(pollBlockList);

        const block = Message()
            .blocks(
                Blocks.Header()
                    .text("Hi there! My name is Zork"),
                Blocks.Actions()
                    .elements(
                        Button()
                            .text("Create New Poll")
                            .value("create_poll")
                            .primary()
                    ),
                Blocks.Section()
                    .text("*Your Polls*"),
                Blocks.Divider(),
                ...pollBlockList


            )
            .buildToJSON()

        return JSON.parse(block)

    }


    // static fridayFeedback() {
    //     const message: string = Message()
    //         .blocks(
    //     )
    //         .buildToJSON()
    //     return JSON.parse(message)
    // }

}