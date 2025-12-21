const { ActivityType } = require("discord.js");
const { Print } = require("../handler/extraHandler");

module.exports = {
    name : "clientReady",
    eventrun(client) {
        Print("[CLIENT] Bot Is functioning", "Green");
        client.user.setPresence({ activities: [{ name: "Getting coded by ranox", type: ActivityType.Playing }] });
    }
}