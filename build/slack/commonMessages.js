"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMessages = void 0;
var slack_block_builder_1 = require("slack-block-builder");
var CommonMessages = /** @class */ (function () {
    function CommonMessages() {
    }
    CommonMessages.createPollModel = function () {
        var model = (0, slack_block_builder_1.Modal)()
            .title("Zork")
            .submit("Submit")
            .close("Cancel")
            .blocks(slack_block_builder_1.Blocks.Header()
            .text("Let's start creating your poll"), slack_block_builder_1.Blocks.Input()
            .blockId("channels")
            .label("Channel(s)")
            .optional(false)
            .element(slack_block_builder_1.Elements.ChannelMultiSelect()
            .maxSelectedItems(5)
            .focusOnLoad(false)
            .placeholder("Where should the poll be sent?")), slack_block_builder_1.Blocks.Input()
            .blockId("questions")
            .label("Question")
            .optional(false)
            .element(slack_block_builder_1.Elements.TextInput()
            .placeholder("Write your question...")
            .multiline(false)
            .maxLength(1000)), slack_block_builder_1.Blocks.Input()
            .blockId("options")
            .label("Enter your option(s) below")
            .optional(false)
            .element(slack_block_builder_1.Elements.TextInput()
            .placeholder("Write each option on a seperate line")
            .multiline(true)
            .maxLength(1000)))
            .buildToJSON();
        return JSON.parse(model);
    };
    CommonMessages.generatePoll = function (data, optional) {
        var _a, _b;
        var question = data.question, options = data.options;
        var username = optional.username, status = optional.status;
        var optionBlock = options.map(function (option) {
            return slack_block_builder_1.Blocks.Section()
                .text("*".concat(option.value, ".* ").concat(option.text, " "));
        });
        var optionButtons = options.map(function (option) {
            return slack_block_builder_1.Elements.Button()
                .value("".concat(option.value))
                .text("".concat(option.value));
        });
        var poll = (_a = (0, slack_block_builder_1.Message)())
            .blocks.apply(_a, __spreadArray(__spreadArray([slack_block_builder_1.Blocks.Section({ text: "@channel \n" }),
            slack_block_builder_1.Blocks.Section()
                .text(question), (_b = slack_block_builder_1.Blocks.Actions())
                .elements.apply(_b, optionButtons)], optionBlock, false), [slack_block_builder_1.Blocks.Divider(),
            slack_block_builder_1.Blocks.Context()
                .elements([
                "Sender: ".concat(username, " "),
                "| ",
                "Poll status: ".concat(status ? "open" : "closed", " ")
            ])], false)).buildToJSON();
        return JSON.parse(poll);
    };
    CommonMessages.updatePoll = function (data, optional) {
        var _a, _b;
        var question = data.question, options = data.options, responses = data.responses;
        var username = optional.username, status = optional.status;
        var totalResponses = responses.length;
        var optionBlock = options.map(function (option) {
            var resp = responses.filter(function (res) { return (+res.userResponse) === (option.value); });
            var users = resp.map(function (r) { return "@".concat(r.username, " "); }).toString();
            return slack_block_builder_1.Blocks.Section()
                .text("*".concat(option.value, ".* ").concat(option.text, "  *(").concat(Math.round(resp.length / totalResponses * 100), ")*   ").concat(users));
        });
        var optionButtons = options.map(function (option) {
            return slack_block_builder_1.Elements.Button()
                .value("".concat(option.value))
                .text("".concat(option.value));
        });
        var poll = (_a = (0, slack_block_builder_1.Message)())
            .blocks.apply(_a, __spreadArray(__spreadArray([slack_block_builder_1.Blocks.Section({ text: "@channel \n" }),
            slack_block_builder_1.Blocks.Section()
                .text(question), (_b = slack_block_builder_1.Blocks.Actions())
                .elements.apply(_b, optionButtons)], optionBlock, false), [slack_block_builder_1.Blocks.Divider(),
            slack_block_builder_1.Blocks.Context()
                .elements([
                "Sender: ".concat(username, " "),
                "| ",
                "Poll status: ".concat(status ? "open" : "closed", " ")
            ])], false)).buildToJSON();
        return JSON.parse(poll);
    };
    CommonMessages.dinnerMessage = function (args) {
        var message = (0, slack_block_builder_1.Message)()
            .blocks(slack_block_builder_1.Blocks.Section({ text: "@channel \n" }), slack_block_builder_1.Blocks.Section({ text: "".concat(slack_block_builder_1.Md.bold("Are you staying back for dinner :knife_fork_plate: tonight?"), " \n") }), slack_block_builder_1.Blocks.Divider(), slack_block_builder_1.Blocks.Section()
            .text("YES")
            .accessory(slack_block_builder_1.Elements.Button()
            .text("YES")
            .primary()), slack_block_builder_1.Blocks.Section()
            .text("NO")
            .accessory(slack_block_builder_1.Elements.Button()
            .text("NO")
            .danger()), slack_block_builder_1.Blocks.Divider(), slack_block_builder_1.Blocks.Context()
            .elements([
            "Sender: ".concat(args.senderId, " "),
            "| ",
            "Poll status: ".concat(args.status.toLowerCase(), " ")
        ]))
            .buildToJSON();
        return JSON.parse(message);
    };
    return CommonMessages;
}());
exports.CommonMessages = CommonMessages;
