// import { slackInteraction } from "./../connections/slackConn"

import { ActionHandler, createMessageAdapter } from "@slack/interactive-messages";
import { EventService } from "../services/event.service";
import { InteractionService } from "../services/interaction.service";

const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)
const slackInteraction = createMessageAdapter(signing_secret);

export declare module View {

    export interface Team {
        id: string;
        domain: string;
    }

    export interface User {
        id: string;
        username: string;
        name: string;
        team_id: string;
    }

    export interface Text {
        type: string;
        text: string;
        emoji: boolean;
    }

    export interface Label {
        type: string;
        text: string;
        emoji: boolean;
    }

    export interface Placeholder {
        type: string;
        text: string;
        emoji: boolean;
    }

    export interface DispatchActionConfig {
        trigger_actions_on: string[];
    }

    export interface Element {
        type: string;
        action_id: string;
        placeholder: Placeholder;
        dispatch_action_config: DispatchActionConfig;
        multiline?: boolean;
    }

    export interface Block {
        type: string;
        block_id: string;
        text: Text;
        label: Label;
        optional?: boolean;
        dispatch_action?: boolean;
        element: Element;
    }

    export interface Channels2 {
        type: string;
        selected_channels: any[];
    }

    export interface Channels {
        channels: Channels2;
    }

    export interface Question2 {
        type: string;
        value?: any;
    }

    export interface Question {
        Question: Question2;
    }

    export interface PlainTextInputAction {
        type: string;
        value?: any;
    }

    export interface Options {
        "plain_text_input-action": PlainTextInputAction;
    }

    export interface Values {
        channels: Channels;
        questions: Question;
        options: Options;
    }

    export interface State {
        values: Values;
    }

    export interface Title {
        type: string;
        text: string;
        emoji: boolean;
    }

    export interface Close {
        type: string;
        text: string;
        emoji: boolean;
    }

    export interface Submit {
        type: string;
        text: string;
        emoji: boolean;
    }

    export interface View {
        id: string;
        team_id: string;
        type: string;
        blocks: Block[];
        private_metadata: string;
        callback_id: string;
        state: State;
        hash: string;
        title: Title;
        clear_on_close: boolean;
        notify_on_close: boolean;
        close: Close;
        submit: Submit;
        previous_view_id?: any;
        root_view_id: string;
        app_id: string;
        external_id: string;
        app_installed_team_id: string;
        bot_id: string;
    }

    export interface ViewSubmission {
        type: string;
        team: Team;
        user: User;
        api_app_id: string;
        token: string;
        trigger_id: string;
        view: View;
        response_urls: any[];
        is_enterprise_install: boolean;
        enterprise?: any;
    }

}


slackInteraction
    .action({ type: "button", blockId: "add_link_input", actionId: "add_link_input" }, async (payload) => {
        console.log("Entered Block Action Interaction ==================================================");
        console.log(payload);
    })


slackInteraction
    .action({ type: 'button', blockId: "poll_inputs" }, async (payload, response) => {
        try {
            console.log(payload);
            const service = await new InteractionService().pollResponse(payload);
            console.log(service)
        } catch (error) {
            console.log(error)
        }

    })


slackInteraction
    .action({ type: 'button', actionId: "close_poll" }, async (payload, response) => {
        try {
            console.log(payload);
            const userId = payload.user.id
            const service = await new InteractionService().closePoll(payload);
            console.log(service)
            const viewSubmission = await new EventService().appHomeMention(userId, "")
            console.log(viewSubmission);
        } catch (error) {
            console.log(error)
        }

    })


slackInteraction
    .viewSubmission("", async (payload: View.ViewSubmission) => {
        try {
            console.log(payload);
            const service = await new InteractionService().viewSubmission(payload);
            console.log(service);
        } catch (error) {
            console.log(error)
        }

    })

export { slackInteraction }