const { EmbedBuilder } = require("discord.js");
const { getPrefix } = require("../data/ServerDB");
const { DB } = require("../handler/dbHandler");
const { Print } = require("../handler/extraHandler");
const { ErrorLog } = require("../handler/logsHanlder");

module.exports = {
    name: "messageCreate",
    async eventrun(client, mg) {
        try {
            if (mg.author.bot) return;
            if (!mg.guild) return;

            const data = await getPrefix(DB, mg.guild.id);
            const prefix = data?.[0]?.prefix || "!";

            if (!mg.content.startsWith('!') && !mg.content.startsWith(prefix)) {
                const notpre = new EmbedBuilder()
                    .setDescription("Command usage is incorrect").setColor("Red")
                return mg.reply({ embeds: [notpre] })
            };

            let len = prefix.length;

            if (mg.content.startsWith('!')) len = 1;

            const args = mg.content.slice(len).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            const precmd = client.prefixs.get(command) || client.prefixs.find(cmd => cmd.aliases && cmd.aliases.includes(command));

            if (!precmd) return;

            //Cooldown
            if (precmd.cooldown) {
                let cooldownUntil = client.cooldowns.get(`${precmd.name}-${mg.author.id}`);
                if (cooldownUntil && cooldownUntil > Date.now()) {
                    const coolembed = new EmbedBuilder()
                        .setDescription(`Command is on cooldown for ${Math.ceil((cooldownUntil - Date.now()) / 1000)} secs`).setColor("Red")
                    return mg.reply({ embeds: [coolembed] })
                }

                client.cooldowns.set(`${precmd.name}-${mg.author.id}`, new Date().valueOf() + precmd.cooldown);
            }

            //Staff
            if (precmd.admin)
                if (!mg.member.permissions.has("Administrator")) {
                    const permbed = new EmbedBuilder()
                        .setDescription("You're not an admin to use this command!").setColor("Red")
                    return mg.reply({ embeds: [permbed] })
                }

            precmd.prerun(mg, client);
        } catch (err) {
            Print("[ERROR] " + err, "Red");
            ErrorLog("Message", err);
        }
    }
}