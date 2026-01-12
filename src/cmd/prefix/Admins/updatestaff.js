const { EmbedBuilder } = require("discord.js");
const { ServerC, getStaffR, setStaffR } = require("../../../data/ServerDB");
const { Print } = require("../../../handler/extraHandler");
const { ErrorLog } = require("../../../handler/logsHanlder");

module.exports = {
    name: "staff-role",
    admin: true,
    cooldown: 50000,
    async prerun(mg) {
        try {
            const guild = mg.guild;
            let roleID = (mg.content.split(" "))[1];

            if (!guild.roles.cache.has(roleID))
                return mg.reply("Unfound role");

            let oldStaffR = await getStaffR(ServerC, guild.id);
            let setStaff = await setStaffR(ServerC, guild.id, roleID);

            if (!setStaff)
                return mg.reply("Something went wrong, please use this command later.");

            const staffUpdateEmbed = new EmbedBuilder().setTimestamp().setFooter({ text: `${guild.name}` }).setColor("Aqua");

            if (!oldStaffR) {
                staffUpdateEmbed.setDescription(`Staff has been set to <@&${setStaffR}>`);
            } else if (oldStaffR[0].staffRID == roleID) {
                staffUpdateEmbed.setDescription(`Cannot update role, it's already been updated with the same ID`).setColor("Red");
            } else {
                staffUpdateEmbed.setTitle("Staff update").setDescription(`- **Old staff role :** <@&${oldStaffR[0].staffRID}>\n- **New staff role :** <@&${roleID}>`);
            }

            mg.channel.send({ embeds: [staffUpdateEmbed] });
        } catch (error) {
            Print("[STAFFCHANGE] " + error, "Red");
            ErrorLog("STAFFCHANGE", error);
        }
    },
}