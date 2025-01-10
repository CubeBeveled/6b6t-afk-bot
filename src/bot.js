const mineflayer = require("mineflayer");
const { randomInt } = require("crypto");
const color = require("colors");

const sleep = (toMs) => {
  return new Promise((r) => {
    setTimeout(r, toMs);
  });
};

function getRandomBoolean() {
  return randomInt(-1, 1) < 0;
}

function randomString(length) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, alphabet.length);
    randomString += alphabet.charAt(randomIndex);
  }

  return randomString;
}

const state = {
  offline: "offline",
  online: "online",
  reconnecting: "reconnecting",
  dead: "dead"
}

// These are here so every bot doesnt send playercount and messages and spam the console
let loggingMsgs = false;
let sentPlayercount = false;
let webhook;

const config = require("./config.json");
if (config.playerLogger.enabled) {
  const { WebhookClient } = require("discord.js");
  webhook = new WebhookClient({ url: config.playerLogger.dcWebhookUrl });
}

class bot {
  constructor(botOptions) {
    this.config = require("./config.json");
    this.botOptions = botOptions;
    this.bot = mineflayer.createBot(this.botOptions);
    this.registerEvents()

    this.playerIndex = 0;
    this.messageIndex = 0;

    this.flaggedCount = 0;
    this.spawned = 0;

    this.currentState = state.offline;
  }

  registerEvents() {
    this.bot.on("error", async (error) => {
      console.log(color.yellow(`[${this.botOptions.username}] Error: `) + error.message)
      this.currentState = state.online;
      await this.reconnect();
    });

    this.bot.on("end", async (reason) => {
      console.log(color.yellow(`[${this.botOptions.username}] Connection ended: `) + reason);
    });

    this.bot.on("kicked", async (reason) => {
      console.log(color.yellow(`[${this.botOptions.username}] Kicked: `) + reason)
      this.currentState = state.online;
      await this.reconnect()
    });

    this.bot.on("death", () => {
      this.currentState = state.dead;
    });

    this.bot.on("spawn", () => {
      this.spawned++
      this.currentState = state.online;

      console.log(color.green(`[${this.botOptions.username}] spawned (${this.spawned})`));

      if (this.spawned == 1) {
        this.bot.setControlState("forward", true);
      }

      if (this.spawned == 2) {
        this.bot.setControlState("forward", false);

        if (!sentPlayercount) {
          const players = Object.values(this.bot.players)
            .filter((p) => p.username !== this.botOptions.username)

          console.log(color.green(players.length + " players online"));
          sentPlayercount = true;
        }
      }

      if (this.spawned >= 2) {
        if (this.botOptions.antiAfk) this.movementLoop();
      }
    });

    this.bot.on("message", (msg) => {
      const ansi = msg.toAnsi();
      msg = msg.toString();

      if (this.config.sendChatMessagesInConsole && !loggingMsgs) {
        console.log(ansi);
        loggingMsgs = true;
      }

      if (msg.includes("/login")) {
        this.bot.chat(`/login ${this.botOptions.password}`);
      }

      if (msg.includes("/register") && this.spawned == 1) {
        console.log(color.red(`Username ${color.bold(this.botOptions.username)} has not been registered or is wrong`));
        process.exit("USR_NOT_REG");
      }
    });

    this.bot.on("entitySpawn", (entity) => {
      if (this.config.playerLogger.enabled && entity.type == "player" && entity.username !== this.botOptions.username) {
        console.log(color.gray(`Player ${entity.username} entered view distance.`));

        webhook.send({
          content: this.config.playerLogger.enterRenderDistance.message.replace("%player%", entity.username),
          username: this.config.playerLogger.enterRenderDistance.webhookUsername.replace("%player%", entity.username),
          avatarURL: this.config.playerLogger.enterRenderDistance.webhookAvatarUrl.replace("%player%", entity.username)
        });
      }
    });

    this.bot.on("entityGone", (entity) => {
      if (this.config.playerLogger.enabled && entity.type == "player" && entity.username !== this.botOptions.username) {
        console.log(color.gray(`Player ${entity.username} exited view distance.`));

        webhook.send({
          content: this.config.playerLogger.exitRenderDistance.message.replace("%player%", entity.username),
          username: this.config.playerLogger.exitRenderDistance.webhookUsername.replace("%player%", entity.username),
          avatarURL: this.config.playerLogger.exitRenderDistance.webhookAvatarUrl.replace("%player%", entity.username)
        });
      }
    });
  }

  async movementLoop() {
    const maxMotionDelay = 2000;

    while (this.currentState !== state.online) {
      if (getRandomBoolean()) {
        this.bot.setControlState("jump", true)
        await sleep(randomInt(10, maxMotionDelay))
        this.bot.setControlState("jump", false)
      }

      if (getRandomBoolean()) {
        this.bot.setControlState("forward", true)
        await sleep(randomInt(10, maxMotionDelay))
        this.bot.setControlState("forward", false)
      }

      if (getRandomBoolean()) {
        this.bot.setControlState("back", true)
        await sleep(randomInt(10, maxMotionDelay))
        this.bot.setControlState("back", false)
      }

      if (getRandomBoolean()) {
        this.bot.setControlState("left", true)
        await sleep(randomInt(10, maxMotionDelay))
        this.bot.setControlState("left", false)
      }

      if (getRandomBoolean()) {
        this.bot.setControlState("right", true)
        await sleep(randomInt(10, maxMotionDelay))
        this.bot.setControlState("right", false)
      }

      this.bot.look(randomInt(-180, 180), randomInt(-360, 360));

      await sleep(100);
    }
  }

  async reconnect() {
    if (this.currentState !== state.online) return;
    this.currentState = state.reconnecting;
    if (this.bot) this.bot.end();

    this.spawned = 0;
    await sleep(this.botOptions.reconnectDelay)
    this.bot = mineflayer.createBot(this.botOptions);
    this.registerEvents();
  }
}

module.exports = bot;
