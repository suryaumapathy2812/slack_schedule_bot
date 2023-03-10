const { WebClient, LogLevel } = require("@slack/client");
const { } = require("../common/utils");
const MessageTemplateModel = require("../model/messageTemplateModel");
const PollModel = require("../model/pollModel");
const PollMessageHistoryModel = require("../model/pollMessageHistoryModel");
const SlackMessage = require("./slackMessage");
const PollMessageHistory = require("./pollMessageHistory");

class PollMessage {

    slackMessage;
    web;
    updatePattern;


    constructor() {
        this.updatePattern = /\$\$[a-z]{1,10}[-_][0-9]{1,2}/gi
        this.slackMessage = new SlackMessage();
        this.web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN, {
            logLevel: LogLevel.DEBUG
        });
    }


    async #createPoll({ channelId, ts, userId, username, userResponse }) {

        try {
            const poll = new PollModel({
                channelId: channelId,
                messageId: ts,
                userId: userId,
                username: username,
                userResponse: userResponse
            })

            const db_res = await poll.save();
            console.log("Data recorded", db_res);

            return db_res;

        } catch (error) {
            console.log(error);
        }


    }


    async #findPoll({ channelId, messageId, userId }) {
        const isExist = await PollModel.findOne({ channelId, messageId, userId });
        return isExist;
    }


    async #updatePoll(find, update, options) {

        if (!options) options = {}

        const updateOptions = Object.assign({ new: true }, options)

        try {
            const updateResponse = await PollModel.findOneAndUpdate(
                find,
                update,
                updateOptions
            )
            console.log("updateResponse", updateResponse)

            return updateResponse

        } catch (error) {
            console.log(error);
        }

    }


    async #disablePoll(channelId, templateId, ts) {
        try {
            const disabledPoll = await new PollMessageHistory().updatePollStatus(
                {
                    templateId: templateId,
                    channelId: channelId,
                    ts: ts
                },
                {
                    active: false
                }
            )

            console.log("Poll has be disabled successfully");
            return { status: "success", res: disabledPoll.res }
        } catch (error) {
            console.log("Failed to disable Poll")
            console.log(error)
        }
    }


    async createMessage(channelId, templateName) {
        try {

            const pollResponse = await this.slackMessage.sendRichMessage(channelId, templateName);

            if (pollResponse.status !== "success") {
                throw new Error("Failed to sendRichMessage")
            }

            const { channel, ts, } = pollResponse.res;
            const { templateId } = pollResponse;

            const history = new PollMessageHistoryModel({
                templateId,
                ts,
                channelId: channel,
            })

            const historyResponse = await history.save();
            console.log("Poll Message History recorded =============== ", historyResponse);

        } catch (error) {
            console.log(error)
        }
    }


    async updateMessage(channelId, templateId, ts, { userId, username, userResponse }) {
        try {

            const pollStatus = await new PollMessageHistory().pollStatus(
                {
                    templateId: templateId,
                    channelId: channelId,
                    ts: ts
                }
            );

            if (pollStatus.res.status === false) {
                console.log("Poll is closed, Sorry!!!");
                console.log(pollStatus.res)
                return pollStatus;
            } else {

                console.log("Before Updating Message ============================", channelId, ts, userId, username, userResponse)

                const isExist = await this.#findPoll({ channelId, messageId: ts, userId })
                console.log("Data isExist", isExist);

                if (!isExist) {
                    console.log("Create new user poll response")
                    const db_res = await this.#createPoll({ channelId, ts, userId, username, userResponse });
                    console.log("Data recorded", db_res);

                } else {
                    console.log("Update existing user poll response")

                    // Update existing user poll response

                    const updateResponse = await this.#updatePoll({
                        channelId: isExist.channelId,
                        messageId: isExist.messageId,
                        userId: isExist.userId
                    }, {
                        channelId,
                        ts,
                        userId,
                        username,
                        userResponse
                    })

                    console.log("updateResponse", updateResponse)
                }

                const updatedMessageBlock = await this.#createPollMessage(channelId, templateId, ts)

                console.log(updatedMessageBlock)

                const res = await this.web.chat.update({
                    channel: channelId,
                    ts: ts,
                    as_user: true,
                    blocks: JSON.parse(updatedMessageBlock)
                })
                console.log('Message updated: ==============================', res)
            }

        } catch (error) {
            console.log(error)
        }
    }


    async closeMessage(channelId, templateId, ts) {
        try {


            console.log("Before Disabling Poll ============================", channelId, ts)
            const disabledPoll = await this.#updatePoll(channelId, templateId, ts);
            console.log("disablePoll Success =============================", disabledPoll)

            console.log("Before Updating Message ============================", channelId, ts)

            const updatedMessageBlock = this.#createPollMessage(channelId, templateId, ts)

            const res = await this.web.chat.update({
                channel: channelId,
                ts: ts,
                as_user: true,
                blocks: JSON.parse(updatedMessageBlock)
            })
            console.log('Message updated: ==============================', res)

        } catch (error) {
            console.log(error)
        }
    }



    async #createPollMessage(channelId, templateId, ts) {
        try {

            const responseList = await PollModel.find({ channelId, messageId: ts });
            console.log("Data retrieved", responseList.length, responseList);


            // * Update Template Block  starts here ======================================================================
            let yesList = [];
            let noList = [];

            if (responseList) {
                console.log("list ==========", responseList)

                const _yesList = responseList
                    .filter((option) => option["userResponse"] === "yes")
                    .map((option) => {
                        return "@" + option["username"]
                    })

                yesList = `*(${_yesList.length})*  ` + _yesList.toString();

                console.log("yesList ===================================", yesList)

                const _noList = responseList
                    .filter((option) => option["userResponse"] === "no")
                    .map((option) => {
                        return "@" + option["username"]
                    })

                noList = `*(${_noList.length})*  ` + _noList.toString();

                console.log("noList ===================================", noList)
            }

            console.log("yesList ===========", yesList);
            console.log("noList ==========", noList)
            // * Update Template Block  ends here ======================================================================


            const messageBlock = await MessageTemplateModel.findOne({ templateId })
            console.log("MessageTemplate.findOne() success ====================")
            console.log(messageBlock)

            let userList = [yesList, noList];

            console.log("userList ===========", userList)

            const message = messageBlock.block;

            console.log(this.updatePattern.test(message));
            const patternMatch = message.match(this.updatePattern);
            console.log(patternMatch);

            let updatedMessageBlock = message;

            for (let index = 0; index < patternMatch.length; index++) {

                const matchString = patternMatch[index];
                const replacementString = userList[index] !== undefined ? userList[index] : "";
                console.log(index, matchString, replacementString)
                updatedMessageBlock = updatedMessageBlock.replace(matchString, replacementString);

            }

            console.log(updatedMessageBlock)

            console.log("updatedMessageBlock ===================")
            console.log(typeof updatedMessageBlock)

            return updatedMessageBlock;

        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = PollMessage;
