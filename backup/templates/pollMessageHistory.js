const PollMessageHistoryModel = require("../model/pollMessageHistoryModel");

class PollMessageHistory {

    constructor() {

    }

    async pollStatus(find) {
        try {
            const res = await PollMessageHistoryModel.findOne(find);
            console.log("pollStatus success ==================", res);
            return { status: "success", res }
        } catch (error) {
            console.log(error)
        }
    }


    async updatePollStatus(find, replace, option) {
        try {
            option = Object.assign({ new: true }, option)
            const res = PollMessageHistoryModel.findOneAndUpdate(find, replace, option);
            console.log("UpdatePollStatus success ==================", res);
            return { status: "success", res }
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = PollMessageHistory