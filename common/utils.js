const { v4: uuidv4 } = require('uuid');


const generateMessageId = () => {
    return uuidv4();
}

const messagePatternRecognize = (message) => {

    const channelRx = /[#]([\w]+)*/g;
    const templateRx = /[$]([\w]+)*/g;

    const channel = channelRx.exec(message)[1];
    const template = templateRx.exec(message)[1];

    return { channel, template }
}


module.exports = { generateMessageId, messagePatternRecognize }