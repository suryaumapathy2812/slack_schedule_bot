const express = require("express");
const PollMessageHistoryModel = require("../model/pollMessageHistoryModel");
const PollMessage = require("../templates/pollMessage");
const SlackMessage = require("../templates/slackMessage");
const PollModel = require("./../model/pollModel")
const commandRoutes = express.Router();

commandRoutes.post("/dinner_message", async (req, res) => {
    try {

        console.log(req.body);

        const { channel_id } = req.body
        const dinnerMessageTemplateId = "dinner_message"
        const messageRes = await new SlackMessage().sendRichMessage(channel_id, dinnerMessageTemplateId);
        console.log("Message Sent ================== ", messageRes)

        const { templateId, res: richMessageRes } = messageRes;

        const pollMessageHistory = new PollMessageHistoryModel({ channelId: channel_id, templateId, ts: richMessageRes.ts })
        const pollMessageHistoryResponse = await pollMessageHistory.save();

        console.log("PollMessageHistory recorded Successfully ====================", pollMessageHistoryResponse)


        const schedule = require('node-schedule');
        const dt = new Date();

        const date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes() + 30, dt.getSeconds());

        const job = schedule.scheduleJob(date, function () {
            console.log('The world is going to end today.');

            const closePoll = new PollMessage().closeMessage(channel_id, templateId, richMessageRes.ts);

        });


        res.send("Request Completed");

    } catch (error) {
        console.log(error);
    }

})

commandRoutes.post("/friday_feedback_b3a", async (req, res) => {
    try {

        console.log(req.body);

        const { channel_id } = req.body
        const dinnerMessageTemplateId = "friday_feedback_b3a"
        const messageRes = await new SlackMessage().sendRichMessage(channel_id, dinnerMessageTemplateId);
        console.log("Message Sent ================== ", messageRes)

        const { templateId, res: richMessageRes } = messageRes;

        const pollMessageHistory = new PollMessageHistoryModel({ channelId: channel_id, templateId, ts: richMessageRes.ts })
        const pollMessageHistoryResponse = await pollMessageHistory.save();

        console.log("PollMessageHistory recorded Successfully ====================", pollMessageHistoryResponse)

        res.send("Request Completed");

    } catch (error) {
        console.log(error);
    }

})

commandRoutes.post("/friday_feedback_b3b", async (req, res) => {
    try {

        console.log(req.body);

        const { channel_id } = req.body
        const dinnerMessageTemplateId = "friday_feedback_b3b"
        const messageRes = await new SlackMessage().sendRichMessage(channel_id, dinnerMessageTemplateId);
        console.log("Message Sent ================== ", messageRes)

        const { templateId, res: richMessageRes } = messageRes;

        const pollMessageHistory = new PollMessageHistoryModel({ channelId: channel_id, templateId, ts: richMessageRes.ts })
        const pollMessageHistoryResponse = await pollMessageHistory.save();

        console.log("PollMessageHistory recorded Successfully ====================", pollMessageHistoryResponse)

        res.send("Request Completed");

    } catch (error) {
        console.log(error);
    }

})

commandRoutes.post("/friday_feedback_b3c", async (req, res) => {
    try {

        console.log(req.body);

        const { channel_id } = req.body
        const dinnerMessageTemplateId = "friday_feedback_b3c"
        const messageRes = await new SlackMessage().sendRichMessage(channel_id, dinnerMessageTemplateId);
        console.log("Message Sent ================== ", messageRes)

        const { templateId, res: richMessageRes } = messageRes;

        const pollMessageHistory = new PollMessageHistoryModel({ channelId: channel_id, templateId, ts: richMessageRes.ts })
        const pollMessageHistoryResponse = await pollMessageHistory.save();

        console.log("PollMessageHistory recorded Successfully ====================", pollMessageHistoryResponse)

        res.send("Request Completed");

    } catch (error) {
        console.log(error);
    }

})

commandRoutes.post("/close_poll", async (req, res) => {
    try {
        console.log(req.body);
        const { channel_id } = req.body

        const recentPoll = await PollModel.find({ channelId: channel_id }).sort({ _id: 1 }).limit(1);
        console.log(recentPoll);

        res.send("Request Completed close_poll");

    } catch (error) {
        console.log(error)
    }
})


commandRoutes.post("/request_zork", async (req, res) => {
    console.log(req.body);
    await res.send("Request Received")
})

module.exports = commandRoutes