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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollService = void 0;
var Poll_model_1 = __importDefault(require("../model/Poll.model"));
var commonMessages_1 = require("../slack/commonMessages");
var slackMessage_1 = require("../slack/slackMessage");
var PollService = /** @class */ (function () {
    function PollService() {
    }
    // async createPoll({ question, options, channelId }, { username, status }) {
    PollService.prototype.createPoll = function (data, optional) {
        return __awaiter(this, void 0, void 0, function () {
            var channelId, question, options, user, status, messageBlock, resp, pollinput, poll, db_res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log(data, optional);
                        channelId = data.channelId, question = data.question, options = data.options;
                        user = optional.user, status = optional.status;
                        messageBlock = commonMessages_1.CommonMessages.generatePoll({ question: question, options: options }, { username: user.userName, status: true });
                        return [4 /*yield*/, new slackMessage_1.SlackMessage()
                                .sendMessage(Object.assign(messageBlock, {
                                channel: channelId,
                                text: "Dinner Message"
                            }), { type: "BLOCK" })];
                    case 1:
                        resp = _a.sent();
                        pollinput = {
                            channelId: channelId,
                            question: question,
                            options: options.map(function (opt) { return { "text": opt.text, "value": opt.value }; }),
                            active: true,
                            createdBy: user,
                            modifiedBy: user,
                            ts: resp["ts"],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        };
                        console.log(pollinput);
                        poll = new Poll_model_1.default(pollinput);
                        return [4 /*yield*/, poll.save()];
                    case 2:
                        db_res = _a.sent();
                        console.log("Data recorded", db_res);
                        return [2 /*return*/, { slack: resp, db: db_res }];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, { slack: { status: "falied" }, db: { status: "failed" } }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PollService.prototype.findOnePoll = function (query, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Poll_model_1.default.findOne(query, null, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PollService.prototype.updatePoll = function (filter, update, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Poll_model_1.default.findOneAndUpdate(filter, update, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PollService;
}());
exports.PollService = PollService;
