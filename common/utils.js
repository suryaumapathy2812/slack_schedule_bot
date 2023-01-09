const schedule = require('node-schedule');
const { v4: uuidv4 } = require('uuid');


const updatePattern = /\$\$[a-z]{1,10}[-_][0-9]{1,2}/gi

const generateMessageId = () => {
    return uuidv4();
}

const messagePatternRecognize = (message) => {

    const channelRx = /[#]([\w]+)*/g;
    const templateRx = /[$]([\w]+)*/g;

    const channel = channelRx.exec(message);
    const template = templateRx.exec(message);

    console.log("channel =====", channel)
    console.log("template =====", template)

    if (!channel || !template) {
        return { channel: null, template: null }
    } else {
        return { channel: channel[1], template: template[1] }
    }
}


const updateMessageTemplate = (message, dataArray) => {

    if (typeof dataArray !== "object") dataArray = [];

    console.log(updatePattern.test(message));
    const patternMatch = message.match(updatePattern);
    console.log(patternMatch);

    let updatedMessage = message;

    if (patternMatch) {
        for (let index = 0; index < patternMatch.length; index++) {

            const matchString = patternMatch[index];
            const replacementString = dataArray[index] !== undefined ? dataArray[index] : "";
            console.log(index, matchString, replacementString)
            updatedMessage = updatedMessage.replace(matchString, replacementString);

        }
    }

    console.log(updatedMessage)

    return updatedMessage;
}


var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


module.exports = {
    generateMessageId,
    messagePatternRecognize,
    updateMessageTemplate,
    groupBy
}


