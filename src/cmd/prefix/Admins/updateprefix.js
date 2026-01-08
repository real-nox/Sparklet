const { EmbedBuilder } = require("discord.js")
const { setPrefix, getPrefix } = require("../../../data/ServerDB")
const { DB } = require("../../../handler/dbHandler")
const { Print } = require("../../../handler/extraHandler")
const { ErrorLog } = require("../../../handler/logsHanlder")

module.exports = {
    name: "prefix",
    admin: true,
    cooldown: 10000,
    async prerun(msg) {
        try {
            let prefix = msg.content.split(" ");
            prefix = prefix[1];

            if (prefix.length > 3)
                return msg.reply("Long prefix! Use shorter prefix.");

            let oldPre = await getPrefix(DB, msg.guild.id);
            let resultat = await setPrefix(DB, msg.guild.id, prefix);

            if (!resultat) return msg.reply("An error had happened, please use this command later.");

            const embedR = new EmbedBuilder()
                .setDescription(`Prefix update for **${msg.guild.name}** !\n\n- **Previous Prefix :** ${oldPre}\n- **New Prefix :** ${prefix}`).setTimestamp();

            return msg.channel.send({ embeds: [embedR] });

        } catch (error) {
            Print("[PREFIXCHANGE] " + error, "Red");
            ErrorLog("PREFIXCHANGE", error);
        }
    }
}