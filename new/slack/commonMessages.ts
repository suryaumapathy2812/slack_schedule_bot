import { Message, Blocks, Elements, Md } from 'slack-block-builder';

export interface DinnerMessageArgs {
    status: "OPEN" | "CLOSE";
    channelId?: string;
    text?: string;
}


export class CommonMessages {

    static dinnerMessage(args: DinnerMessageArgs) {
        const message: string = Message()
            .blocks(

                Blocks.Section({ text: `@channel \n\n` }),
                Blocks.Section({ text: `${Md.bold("Are you staying back for dinner :knife_fork_plate: tonight?")} \n` }),
                Blocks.Section({ text: `This Poll is currently ${Md.bold(args.status)} \n` }),

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

}

// const block = CommonMessages.dinnerMessage({
//     channelId: "",
//     status: "OPEN",
//     text: "hello world"
// });

// console.log(typeof block)
// console.log(JSON.parse(block))