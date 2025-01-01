let bots = [];
const bot = require("./bot");
const config = require("./config.json")

for (const b of config.bots) {
  let options = {
    username: b.username,
    host: "6b6t.org", // IP of the server to connect to
    version: "1.20", // Version that the bot will use
    viewDistance: b.viewDistance, // Info in README.md
    password: b.password, // Info in README.md
    sendChatMessagesInConsole: b.sendChatMessagesInConsole, // Info in README.md
    reconnectDelay: b.reconnectDelay, // Info in README.md
    auth: "offline", // Use cracked accounts
    checkTimeoutInterval: 60000, // After how much time of the server not responding the bot should be considered timed out
  }

  bots.push(
    new bot(options)
  )
}