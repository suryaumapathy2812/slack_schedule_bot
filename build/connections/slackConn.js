"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackCommand = exports.slackInteraction = exports.slackEvents = exports.slackWeb = void 0;
var express_1 = __importDefault(require("express"));
var client_1 = require("@slack/client");
var web_api_1 = require("@slack/web-api");
var controllers_1 = require("../controller/controllers");
Object.defineProperty(exports, "slackEvents", { enumerable: true, get: function () { return controllers_1.slackEvents; } });
Object.defineProperty(exports, "slackInteraction", { enumerable: true, get: function () { return controllers_1.slackInteraction; } });
// const signing_secret = "" + (process.env.SLACK_SIGNING_SECRET)
// const slackEvents = createEventAdapter(signing_secret);
// const slackInteraction = createMessageAdapter(signing_secret);
var slackWeb = new client_1.WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
    logLevel: web_api_1.LogLevel.DEBUG
});
exports.slackWeb = slackWeb;
var slackCommand = express_1.default.Router();
exports.slackCommand = slackCommand;
slackCommand.all("**", controllers_1.commandController);
controllers_1.slackInteraction;
