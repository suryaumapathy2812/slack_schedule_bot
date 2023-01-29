import { Block, KnownBlock, ViewsOpenArguments, WebClient } from "@slack/client";
import { slackWeb } from "../connections/slackConn";


export interface Modal {
    triggerId: string;
    view: {
        type: "modal";
        view: {
            type: "plain_text";
            text: string
        };
        blocks: (Block | KnownBlock)[];
    }
}



export class SlackModal {

    private web: WebClient;

    constructor() {
        this.web = slackWeb
    }

    async openModel(model: Modal) {
        try {

            const modelObj: ViewsOpenArguments = {
                trigger_id: model.triggerId,
                view: model.view,
            }

            const res = await this.web.views.open(modelObj)

            return res;

        } catch (error) {
            console.log(error)
        }
    }

}