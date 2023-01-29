import { Message, Blocks, Elements, Md, Modal } from 'slack-block-builder';

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
                        Elements.ChannelMultiSelect()
                            .maxSelectedItems(5)
                            .focusOnLoad(false)
                            .placeholder("Where should the poll be sent?"),
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


    static generatePoll(question: string, options: string[]) {

        const optionBlock = options.map((option, index) => {
            return Blocks.Section()
                .text(`*${index + 1}.* ${option}`)
        })

        const optionButtons = options.map((_, index) => {
            return Elements.Button()
                .value(`${index + 1}`)
                .text(`${index + 1}`)
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
                ...optionBlock
            )
            .buildToJSON()

        return JSON.parse(poll)

    }


    static updatePoll(data: { question: string, options: { text: string; value: number; }[], responses: any[] }, optional: { username: string, status: boolean }) {


        const { question, options, responses } = data;
        const { username: userId, status } = optional

        const totalResponses = responses.length;

        const optionBlock = options.map((option) => {
            const resp = responses.filter(res => (+res.userResponse) === (option.value));

            const users = resp.map(r => `@${r.username} `).toString();

            return Blocks.Section()
                .text(`*${option.value}.* ${option.text}  *(${Math.round(resp.length / totalResponses * 100)})*   ${users}`)
        })

        const optionButtons = options.map((_, index) => {
            return Elements.Button()
                .value(`${index + 1}`)
                .text(`${index + 1}`)
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
                ...optionBlock,
                Blocks.Divider(),
                Blocks.Context()
                    .elements(
                        [
                            `Sender: ${userId} `,
                            `| `,
                            `Poll status: ${status ? "open" : "closed"} `
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

}