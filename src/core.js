const { commandHandler } = require("./handler/commandHandler");
const { config } = require("dotenv"); config({ quiet: true });
const { eventHandler } = require("./handler/eventHandler");
const { ErrorLog } = require("./handler/logsHanlder");
const { Print } = require("./handler/extraHandler");
const { LoadDB } = require("./handler/dbHandler");

const discord = require("discord.js");
const express = require("express");

//Settings
const port = process.env.port;
const token = process.env.TOKEN;

const app = express();
const bot = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.MessageContent
    ]
});

//Bot collections
bot.prefixs = new discord.Collection();
bot.commands = new discord.Collection();
bot.events = new discord.Collection();
bot.cooldowns = new discord.Collection();

app.listen(port, () => {
    //Soon
    console.log("on app")
})

bot.login(token).then(async () => {
    try {
        eventHandler(bot);
        commandHandler(bot);
        await LoadDB();
    } catch (err) {
        Print("[ERROR] " + err, "Red");
        ErrorLog("BOT Launch", err)
    }
});

