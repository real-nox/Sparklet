const { WebhookClient, EmbedBuilder } = require("discord.js");
const { Print } = require("./extraHandler");
const { config } = require("dotenv");
config({ quiet: true });

function ErrorLog(title, message) {
    try {
        const webURI = process.env.WEBURL;
        const ERRwebhook = new WebhookClient({ url: webURI });

        const ERRBED = new EmbedBuilder().setTitle(`${title}`).setDescription(`> ${message}`).setColor("Red");

        ERRwebhook.send({ content : `<@&1227234977985466449>`, embeds: [ERRBED] });
    } catch (err) {
        Print("[ERROR] : " + err, "Red");
    }
}

function EventLog(message) {
    try {
        const webURI = process.env.WEBURLEVENT;
        const ERRwebhook = new WebhookClient({ url: webURI });

        const ERRBED = new EmbedBuilder().setTitle(`Event Started`).setDescription(`${message}`).setColor("DarkGreen").setTimestamp();

        ERRwebhook.send({ embeds: [ERRBED] });
    } catch (err) {
        Print("[ERROR] : " + err, "Red");
    }
}

module.exports = { ErrorLog, EventLog }