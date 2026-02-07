import { config } from "dotenv"; config({ quiet: true });

import { commandHandler } from "./handler/commandHandler.js";
import { eventHandler } from "./handler/eventHandler.js";
import { LoadDB } from "./handler/dbHandler.js";

import { ErrorLog } from "./systems/LogSystem.js";
import { Print } from "./handler/extraHandler.js";

import discord from "discord.js";

//Settings
const token = process.env.TOKEN;

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

bot.login(token).then(async () => {
    try {
        await eventHandler(bot);
        await commandHandler(bot);
        await LoadDB();
    } catch (err) {
        Print("[ERROR BOT] " + err, "Red");
        ErrorLog("BOT Launch", err)
    }
});