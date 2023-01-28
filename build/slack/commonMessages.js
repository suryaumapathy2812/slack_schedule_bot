"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMessages = void 0;
var slack_block_builder_1 = require("slack-block-builder");
var CommonMessages = /** @class */ (function () {
    function CommonMessages() {
    }
    CommonMessages.dinnerMessage = function (args) {
        var message = (0, slack_block_builder_1.Message)()
            .blocks(slack_block_builder_1.Blocks.Section({ text: "@channel \n\n" }), slack_block_builder_1.Blocks.Section({ text: "".concat(slack_block_builder_1.Md.bold("Are you staying back for dinner :knife_fork_plate: tonight?"), " \n") }), slack_block_builder_1.Blocks.Section({ text: "This Poll is currently ".concat(slack_block_builder_1.Md.bold(args.status), " \n") }), slack_block_builder_1.Blocks.Section({ text: "".concat(slack_block_builder_1.Md.bold("YES")) })
            .accessory(slack_block_builder_1.Elements.Button({ text: "YES", value: "YES", accessibilityLabel: "YES" })
            .primary()), slack_block_builder_1.Blocks.Section({ text: "".concat(slack_block_builder_1.Md.bold("NO")) })
            .accessory(slack_block_builder_1.Elements.Button({ text: "NO", value: "NO", accessibilityLabel: "NO" })
            .danger()))
            .buildToJSON();
        return JSON.parse(message);
    };
    return CommonMessages;
}());
exports.CommonMessages = CommonMessages;
// const block = CommonMessages.dinnerMessage({
//     channelId: "",
//     status: "OPEN",
//     text: "hello world"
// });
// console.log(typeof block)
// console.log(JSON.parse(block))
