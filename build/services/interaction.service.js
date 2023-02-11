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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionService = void 0;
var commonMessages_1 = require("../slack/commonMessages");
var conversation_1 = require("../slack/conversation");
var slackMessage_1 = require("../slack/slackMessage");
var poll_service_1 = require("./poll.service");
var PollResponse_service_1 = require("./PollResponse.service");
var InteractionService = /** @class */ (function () {
    function InteractionService() {
    }
    InteractionService.prototype.viewSubmission = function (payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, values, channels, selectedChannels, question, options, messageResp, i, channelId, isPart, resp, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        console.log(payload);
                        user = {
                            userId: payload.user.id,
                            userName: payload.user.username
                        };
                        values = payload.view.state.values;
                        channels = Object.values(values.channels)[0];
                        selectedChannels = channels["selected_conversations"];
                        question = Object.values(values.questions)[0]["value"];
                        options = Object.values(values.options)[0]["value"]
                            .split("\n")
                            .map(function (val, i) { return { text: val, value: i + 1 }; });
                        messageResp = [];
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < selectedChannels.length)) return [3 /*break*/, 6];
                        channelId = selectedChannels[i];
                        return [4 /*yield*/, new conversation_1.Conversations().isPart(channelId, (_a = process.env.BOT_ID) !== null && _a !== void 0 ? _a : "")];
                    case 2:
                        isPart = _b.sent();
                        if (!isPart) return [3 /*break*/, 4];
                        return [4 /*yield*/, new poll_service_1.PollService().createPoll({ question: question, options: options, channelId: channelId }, { user: user, status: true })];
                    case 3:
                        resp = _b.sent();
                        messageResp.push(resp);
                        return [3 /*break*/, 5];
                    case 4:
                        messageResp.push({ slack: { status: "failed", reason: "Bot not part of the Conversation" }, db: { status: "failed" } });
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        console.log(messageResp);
                        return [2 /*return*/, { status: "SUCCESS", code: 200, messageResp: messageResp }];
                    case 7:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [2 /*return*/, { status: "FAILED", code: 400, error: error_1 }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    InteractionService.prototype.pollResponse = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var channelId, ts, userId, username, userResponse, pollResponseService, poll, pollResponse, storeRecord, response, question, options, responses, updatedMessageBlock, messsageUpdateResp, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        channelId = payload.channel.id;
                        ts = payload.message.ts;
                        userId = payload.user.id;
                        username = payload.user.username;
                        userResponse = payload.actions[0].value;
                        pollResponseService = new PollResponse_service_1.PollResponseService();
                        return [4 /*yield*/, new poll_service_1.PollService()
                                .findOnePoll({
                                channelId: channelId,
                                ts: ts
                            })];
                    case 1:
                        poll = _a.sent();
                        if (!poll) {
                            console.log("Poll Not Found");
                            throw new Error("Poll Not Found");
                        }
                        if (!(poll.active === false)) return [3 /*break*/, 2];
                        console.log("Poll is closed, Sorry !!!");
                        console.log(poll);
                        return [3 /*break*/, 7];
                    case 2:
                        console.log("Before Updating Message ============================", channelId, ts, userId, username, userResponse);
                        return [4 /*yield*/, pollResponseService
                                .findOneMessage({
                                channelId: channelId,
                                ts: ts,
                                userId: userId
                            })];
                    case 3:
                        pollResponse = _a.sent();
                        if (!!pollResponse) return [3 /*break*/, 5];
                        return [4 /*yield*/, pollResponseService
                                .createMessage({
                                channelId: channelId,
                                ts: ts,
                                userId: userId,
                                username: username,
                                userResponse: userResponse,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            })];
                    case 4:
                        storeRecord = _a.sent();
                        console.log(storeRecord);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, pollResponseService
                            .updateMessage({
                            channelId: channelId,
                            ts: ts,
                            userId: userId
                        }, {
                            channelId: channelId,
                            ts: ts,
                            userId: userId,
                            username: username,
                            userResponse: userResponse
                        })];
                    case 6:
                        response = _a.sent();
                        console.log(response);
                        _a.label = 7;
                    case 7:
                        question = poll.question;
                        options = poll.options;
                        return [4 /*yield*/, pollResponseService.findAllResponses({
                                channelId: channelId,
                                ts: ts,
                            })];
                    case 8:
                        responses = _a.sent();
                        return [4 /*yield*/, commonMessages_1.CommonMessages
                                .updatePoll({ question: question, options: options, responses: responses }, { username: username, status: poll.active })];
                    case 9:
                        updatedMessageBlock = _a.sent();
                        return [4 /*yield*/, new slackMessage_1.SlackMessage().updateMessage({
                                channel: channelId,
                                ts: ts,
                                text: question,
                                blocks: updatedMessageBlock["blocks"]
                            })];
                    case 10:
                        messsageUpdateResp = _a.sent();
                        return [2 /*return*/, messsageUpdateResp];
                    case 11:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [2 /*return*/, error_2];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    InteractionService.prototype.closePoll = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var block_id, ts, pollService, closePoll, poll, channelId, question, options, user, status, responses, updatedMessageBlock, messsageUpdateResp, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        block_id = payload.actions[0].block_id;
                        ts = JSON.parse(block_id);
                        pollService = new poll_service_1.PollService();
                        return [4 /*yield*/, pollService.closePoll({ ts: ts, active: true })];
                    case 1:
                        closePoll = _a.sent();
                        return [4 /*yield*/, pollService.findOnePoll({ ts: ts })];
                    case 2:
                        poll = _a.sent();
                        console.log(poll);
                        if (!poll) {
                            throw new Error("Poll not found");
                        }
                        channelId = poll.channelId;
                        question = poll.question;
                        options = poll.options;
                        user = poll.createdBy;
                        status = poll.active;
                        console.log("========================================================");
                        console.log(channelId, question, options, user, status);
                        console.log("========================================================");
                        return [4 /*yield*/, new PollResponse_service_1.PollResponseService().findAllResponses({
                                ts: ts,
                            })];
                    case 3:
                        responses = _a.sent();
                        return [4 /*yield*/, commonMessages_1.CommonMessages.updatePoll({ question: question, options: options, responses: responses }, { username: user.userName, status: status })];
                    case 4:
                        updatedMessageBlock = _a.sent();
                        console.log(updatedMessageBlock);
                        return [4 /*yield*/, new slackMessage_1.SlackMessage().updateMessage({
                                channel: channelId,
                                ts: ts,
                                text: "This Poll is Closed",
                                blocks: updatedMessageBlock["blocks"]
                            })];
                    case 5:
                        messsageUpdateResp = _a.sent();
                        console.log(messsageUpdateResp);
                        return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return InteractionService;
}());
exports.InteractionService = InteractionService;
