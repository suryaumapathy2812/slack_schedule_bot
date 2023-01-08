const { WebClient, LogLevel } = require("@slack/client");
const { groupBy, updateMessageTemplate } = require("../common/utils");
const MessageTemplate = require("../model/messageTemplate");
const Poll = require("../model/poll");
const PollMessageHistory = require("../model/pollMessageHistory");
const SlackMessage = require("./slackMessage");

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

    async createMessage(channelId, templateName) {
        try {
            const pollResponse = await this.slackMessage.sendRichMessage(channelId, templateName);

            if (pollResponse.status !== "success") {
                throw new Error("Failed to sendRichMessage")
            }

            //  !  set record in DB
            const { channel, ts, } = pollResponse.res;
            const { templateId } = pollResponse;

            const history = new PollMessageHistory({
                templateId,
                ts,
                channelId: channel
            })

            const historyResponse = await history.save();
            console.log("Poll Message History recorded =============== ", historyResponse);


        } catch (error) {
            console.log(error)
        }
    }



    async updateMessage(channelId, templateId, ts, { userId, username, userResponse }) {
        try {

            console.log("Before Updating Message ============================", channelId, ts, userId, username, userResponse)

            const isExist = await Poll.findOne({ channelId, messageId: ts, userId });
            console.log("Data isExist", isExist);

            if (!isExist) {
                console.log("Create new user poll response")

                // create new user poll response
                const poll = new Poll({
                    channelId: channelId,
                    messageId: ts,
                    userId: userId,
                    username: username,
                    userResponse: userResponse
                })

                const db_res = await poll.save();
                console.log("Data recorded", db_res);

            } else {
                console.log("Update existing user poll response")

                // Update existing user poll response
                const updateResponse = await Poll.findOneAndUpdate({
                    channelId: isExist.channelId,
                    messageId: isExist.messageId,
                    userId: isExist.userId
                }, {
                    channelId,
                    ts,
                    userId,
                    username,
                    userResponse
                }, { new: true })
                console.log("updateResponse", updateResponse)
            }

            const responseList = await Poll.find({ channelId, messageId: ts, userId });
            console.log("Data retrieved", responseList.length, responseList);

            // * generate user data and messageBlock

            let yesList = [];
            let mdYesList = "";
            let noList = [];
            let mdNoList = "";

            if (responseList) {
                console.log("list ==========", responseList)

                yesList = responseList
                    .filter((option) => option["userResponse"] === "yes")
                    .map((option) => {
                        return "@" + option["username"]
                    });

                mdYesList = yesList
                    .toString()
                    .replace(",", ", @");


                noList = responseList
                    .filter((option) => option["userResponse"] === "no")
                    .map((option) => {
                        return "@" + option["username"]
                    });

                mdNoList = noList
                    .toString()
                    .replace(",", ", @");
            }

            console.log("mdYesList ===========", mdYesList);
            console.log("mdNoList ==========", mdNoList)


            const messageBlock = await MessageTemplate.findOne({ templateId })
            console.log("MessageTemplate.findOne() success ====================")
            console.log(messageBlock)

            let userList = [mdYesList, mdNoList];

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

            console.log("block ===================")
            console.log(typeof block)

            const res = await this.web.chat.update({
                channel: channelId,
                ts: ts,
                as_user: true,
                blocks: updatedMessageBlock
            })
            console.log('Message updated: ==============================', res)

        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = PollMessage;
