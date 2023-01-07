const { SocketModeClient } = require('@slack/socket-mode');
const { LogLevel } = require('@slack/web-api');

// Socket Mode
// Read a token from the environment variables
const appToken = process.env.SLACK_APP_TOKEN;

// Initialize
const socketModeClient = new SocketModeClient({ appToken, logLevel: LogLevel.DEBUG });

// Attach listeners to events by type. See: https://api.slack.com/events/message
socketModeClient.on('message', (event) => {
    console.log(event);
});


module.exports = { socketModeClient }