"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMessages = void 0;
var moment_1 = __importDefault(require("moment"));
var slack_block_builder_1 = require("slack-block-builder");
var progressBar_1 = require("../utils/progressBar");
var channel_1 = require("./channel");
var CommonMessages = /** @class */ (function () {
    function CommonMessages() {
    }
    CommonMessages.createPollModal = function () {
        var model = (0, slack_block_builder_1.Modal)()
            .title("Zork")
            .submit("Submit")
            .close("Cancel")
            .blocks(slack_block_builder_1.Blocks.Header()
            .text("Let's start creating your poll"), slack_block_builder_1.Blocks.Input()
            .blockId("channels")
            .label("Channel(s)")
            .optional(false)
            .element(slack_block_builder_1.Elements.ConversationMultiSelect()
            .maxSelectedItems(5)
            .focusOnLoad(true)
            .placeholder("Where should the poll be sent?")), slack_block_builder_1.Blocks.Context()
            .elements("*Note*: Integrate ".concat(slack_block_builder_1.Md.bold("Zork"), " in the above channels before sending the Poll, else you will not be receving the Polls")), slack_block_builder_1.Blocks.Input()
            .blockId("questions")
            .label("Question")
            .optional(false)
            .element(slack_block_builder_1.Elements.TextInput()
            .placeholder("Write your question...")
            .multiline(true)
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
        var _a;
        var question = data.question, options = data.options;
        var username = optional.username, status = optional.status;
        var optionButtons = options.map(function (option) {
            return slack_block_builder_1.Elements.Button()
                .actionId("poll_input_" + option.value)
                .value("".concat(option.value))
                .text("".concat(option.text));
        });
        // const optionBlock = options.map((option) => {
        //     return Blocks.Section()
        //         .text(`*${option.value}.* ${option.text} `)
        // })
        var poll = (0, slack_block_builder_1.Message)()
            .blocks(slack_block_builder_1.Blocks.Section({ text: "@channel \n" }), slack_block_builder_1.Blocks.Section()
            .text(question), (_a = slack_block_builder_1.Blocks.Actions()
            .blockId("poll_inputs"))
            .elements.apply(_a, optionButtons), 
        // ...optionBlock,
        slack_block_builder_1.Blocks.Divider(), slack_block_builder_1.Blocks.Context()
            .elements([
            "Sender: ".concat(username, " "),
            "| ",
            "Poll status: ".concat(status ? "open" : "closed", " ")
        ]))
            .buildToJSON();
        return JSON.parse(poll);
    };
    CommonMessages.updatePoll = function (data, optional) {
        var _a, _b;
        var _c;
        console.log("=========================================================================");
        console.log(data, optional);
        var question = data.question, options = data.options;
        var responses = (_c = data.responses) !== null && _c !== void 0 ? _c : [];
        var username = optional.username, status = optional.status;
        var totalResponses = responses.length;
        console.log(totalResponses);
        var optionBlock = options.map(function (option) {
            var _a;
            var resp = responses.filter(function (res) { return (+res.userResponse) === (option.value); });
            var users = resp.map(function (r) { return "@".concat(r.username, " "); }).toString();
            var length = (_a = resp.length) !== null && _a !== void 0 ? _a : 0;
            return (" \n                ".concat(option.text, " \n\n").concat(slack_block_builder_1.Md.codeInline(progressBar_1.ProgressBar.generateProgressBar(length)), " | ").concat(Math.round(resp.length / totalResponses * 100), " (").concat(resp.length, ") \n\n").concat(users, "\n                "));
        });
        var optionButtons;
        console.log(status);
        if (status) {
            optionButtons = (_a = slack_block_builder_1.Blocks.Actions()
                .blockId("poll_inputs"))
                .elements.apply(_a, options.map(function (option) {
                return slack_block_builder_1.Elements.Button()
                    .actionId("poll_input_" + option.value)
                    .value("".concat(option.value))
                    .text("".concat(option.text));
            }));
            console.log(optionButtons);
        }
        else {
            optionButtons = slack_block_builder_1.Blocks.Divider();
            console.log(optionButtons);
        }
        var poll = (0, slack_block_builder_1.Message)()
            .blocks(slack_block_builder_1.Blocks.Section({ text: "@channel \n" }), slack_block_builder_1.Blocks.Section()
            .text(question), optionButtons, (_b = slack_block_builder_1.Blocks.Section())
            .fields.apply(_b, optionBlock), slack_block_builder_1.Blocks.Divider(), slack_block_builder_1.Blocks.Context()
            .elements([
            "Sender: ".concat(username, " "),
            "| ",
            "Poll status: ".concat(status ? "open" : "closed", " "),
            "| ",
            "Reponses: ".concat(totalResponses)
        ]))
            .buildToJSON();
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
    CommonMessages.app_home_mention_loading = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                message = (0, slack_block_builder_1.Message)()
                    .blocks(slack_block_builder_1.Blocks.Header()
                    .text("Hi @".concat(userName, " :wave:")), slack_block_builder_1.Blocks.Divider(), slack_block_builder_1.Blocks.Section()
                    .text("If your are in the mood to create a new Poll then :point_right:")
                    .accessory(slack_block_builder_1.Elements.Button()
                    .text("Create new poll")
                    .primary()
                    .actionId("create_poll")
                    .value("create_poll")), 
                // Blocks.Divider(),
                slack_block_builder_1.Blocks.Header()
                    .text("Here are some of the recent Poll that you created"), slack_block_builder_1.Blocks.Section()
                    .text(":cyclone: Loading...."))
                    .buildToJSON();
                return [2 /*return*/, JSON.parse(message)];
            });
        });
    };
    CommonMessages.app_home_mention = function (userName, polls) {
        return __awaiter(this, void 0, void 0, function () {
            var pollBlock, _pollBlockList, pollBlockList, block;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pollBlock = function (poll, pollResponses) { return __awaiter(_this, void 0, void 0, function () {
                            var channelId, active, createdBy, ts, question, options, createdAt, optionsString, channelName, section, context, divider;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        channelId = poll.channelId, active = poll.active, createdBy = poll.createdBy, ts = poll.ts;
                                        question = poll.question, options = poll.options, createdAt = poll.createdAt;
                                        optionsString = options.map(function (_opt) { return "".concat(slack_block_builder_1.Md.bold(_opt.text)); }).toString().replace(",", " \n");
                                        return [4 /*yield*/, new channel_1.Channel().getName(channelId)];
                                    case 1:
                                        channelName = _a.sent();
                                        section = slack_block_builder_1.Blocks.Section()
                                            .blockId(JSON.stringify(ts))
                                            .text(" \n".concat(question, " \n\n").concat(optionsString))
                                            .accessory(slack_block_builder_1.Elements.Button()
                                            .actionId("close_poll")
                                            .text("Close Poll")
                                            .value("close_poll")
                                            .danger());
                                        context = slack_block_builder_1.Blocks.Context()
                                            .elements([
                                            "Sender : @".concat(createdBy.userName),
                                            "|",
                                            "Channel: #".concat(channelName),
                                            "| ",
                                            "Status : ".concat(active ? "open" : "closed"),
                                            "|",
                                            "On : ".concat((0, moment_1.default)(createdAt).format('MMM Do, h:mm a'))
                                            // `|`,
                                            // `Responses : `
                                        ]);
                                        divider = slack_block_builder_1.Blocks.Divider();
                                        return [2 /*return*/, [section, context, divider]];
                                }
                            });
                        }); };
                        _pollBlockList = polls.map(function (poll) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, pollBlock(poll)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        return [4 /*yield*/, Promise.all(_pollBlockList)];
                    case 1:
                        pollBlockList = _b.sent();
                        block = (_a = (0, slack_block_builder_1.Message)())
                            .blocks.apply(_a, __spreadArray([slack_block_builder_1.Blocks.Header()
                                .text("Hi @".concat(userName, " :wave:")),
                            slack_block_builder_1.Blocks.Divider(),
                            slack_block_builder_1.Blocks.Section()
                                .text("If your are in the mood to create a new Poll then :point_right:")
                                .accessory(slack_block_builder_1.Elements.Button()
                                .text("Create new poll")
                                .primary()
                                .actionId("create_poll")
                                .value("create_poll")),
                            // Blocks.Divider(),
                            slack_block_builder_1.Blocks.Header()
                                .text("Here are some of the recent Poll that you created"),
                            slack_block_builder_1.Blocks.Divider()], pollBlockList, false)).buildToJSON();
                        return [2 /*return*/, JSON.parse(block)];
                }
            });
        });
    };
    CommonMessages.createLinkModal = function () {
        var model = (0, slack_block_builder_1.Modal)()
            .title("Zork")
            .submit("Submit")
            .close("Cancel")
            .blocks(slack_block_builder_1.Blocks.Header()
            .text("Let's start creating your poll"), slack_block_builder_1.Blocks.Input()
            .blockId("channels")
            .label("Channel(s)")
            .optional(false)
            .element(slack_block_builder_1.Elements.ConversationMultiSelect()
            .maxSelectedItems(5)
            .focusOnLoad(true)
            .placeholder("Where should the poll be sent?")), slack_block_builder_1.Blocks.Context()
            .elements("*Note*: Integrate ".concat(slack_block_builder_1.Md.bold("Zork"), " in the above channels before sending the Poll, else you will not be receving the Polls")), slack_block_builder_1.Blocks.Input()
            .blockId("message")
            .label("Message")
            .optional(false)
            .element(slack_block_builder_1.Elements.TextInput()
            .placeholder("Write your message...")
            .multiline(true)
            .maxLength(1000)), slack_block_builder_1.Blocks.Input()
            .label("URL")
            .optional(false)
            .element(slack_block_builder_1.Elements.URLInput()
            .placeholder("Paste your link here...")), slack_block_builder_1.Blocks.Actions()
            .blockId("add_link_input")
            .elements(slack_block_builder_1.Elements.Button()
            .text("Add Another Link")
            .accessibilityLabel("Add another link")
            .value("add_link_input")
            .primary()
            .actionId("add_link_input")))
            .buildToJSON();
        return JSON.parse(model);
    };
    return CommonMessages;
}());
exports.CommonMessages = CommonMessages;
