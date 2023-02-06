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
var slackMessage_1 = require("../slack/slackMessage");
var poll_service_1 = require("./poll.service");
var PollResponse_service_1 = require("./PollResponse.service");
var InteractionService = /** @class */ (function () {
    function InteractionService() {
    }
    InteractionService.prototype.viewSubmission = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var user, view, values, channels, selectedChannels, question, options, messageResp, i, resp, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        user = {
                            userId: payload.user.id,
                            userName: payload.user.username
                        };
                        view = payload.view;
                        values = view.state.values;
                        channels = Object.values(values.channels)[0];
                        selectedChannels = channels["selected_channels"];
                        question = Object.values(values.questions)[0]["value"];
                        options = Object.values(values.options)[0]["value"]
                            .split("\n")
                            .map(function (val, i) { return { text: val, value: i + 1 }; });
                        messageResp = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < selectedChannels.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new poll_service_1.PollService().createPoll({ question: question, options: options, channelId: selectedChannels[i] }, { user: user, status: true })];
                    case 2:
                        resp = _a.sent();
                        console.log(resp);
                        messageResp.push(resp);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, { status: "SUCCESS", code: 200, messageResp: messageResp }];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, { status: "FAILED", code: 400, error: error_1 }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    InteractionService.prototype.pollResponse = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var channelId, ts, userId, username, userResponse, poll, pollResponseService, pollResponse, storeRecord, response, question, options, responses, updatedMessageBlock, messsageUpdateResp, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        channelId = payload.channel.id;
                        ts = payload.message.ts;
                        userId = payload.user.id;
                        username = payload.user.username;
                        userResponse = payload.actions[0].value;
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
                        return [2 /*return*/, poll];
                    case 2:
                        pollResponseService = new PollResponse_service_1.PollResponseService();
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
                                text: "",
                                blocks: updatedMessageBlock["blocks"]
                            })];
                    case 10:
                        messsageUpdateResp = _a.sent();
                        return [2 /*return*/, messsageUpdateResp];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return InteractionService;
}());
exports.InteractionService = InteractionService;
