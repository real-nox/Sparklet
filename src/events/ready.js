import { ActivityType } from "discord.js";
import { Print } from "../handler/extraHandler.js"

export default {
    name : "clientReady",
    eventrun(client) {
        Print("[CLIENT] Bot Is functioning", "Green");
        client.user.setPresence({ activities: [{ name: "Getting coded by ranox", type: ActivityType.Playing }] });
    }
}