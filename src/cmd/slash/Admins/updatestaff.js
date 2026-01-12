const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require("discord.js");
const { ServerC, getStaffR, setStaffR } = require("../../../data/ServerDB");
const { Print } = require("../../../handler/extraHandler");
const { ErrorLog } = require("../../../handler/logsHanlder");

module.exports = {
    admin: true,
    cooldown: 50000,
    data: new SlashCommandBuilder()
        .setName('staff-role')
        .setDescription('Set/Update staff role in order to give them permission to use staff commands.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Put your staff role here!')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            let roleId = interaction.options.getRole('role').id;

            if (!guild.roles.cache.has(roleId))
                return interaction.reply({ content: "Unfound role", flags: MessageFlags.Ephemeral });

            let oldStaffR = await getStaffR(ServerC, guild.id);
            let setStaff = await setStaffR(ServerC, guild.id, roleId);

            if (!setStaff)
                return interaction.reply({ content: "Something went wrong, please use this command later.", flags: MessageFlags.Ephemeral });

            const staffUpdateEmbed = new EmbedBuilder().setTimestamp().setFooter({ text: `${guild.name}` }).setColor("Aqua");

            if (!oldStaffR) {
                staffUpdateEmbed.setDescription(`Staff has been set to <@&${setStaffR}>`);
            } else if (oldStaffR[0].staffRID == roleId) {
                staffUpdateEmbed.setDescription(`Cannot update role, it's already been updated with the same ID`).setColor("Red");
            } else {
                staffUpdateEmbed.setTitle("Staff update").setDescription(`- **Old staff role :** <@&${oldStaffR[0].staffRID}>\n- **New staff role :** <@&${roleId}>`);
            }

            await interaction.reply({ embeds: [staffUpdateEmbed] })
        } catch (error) {
            Print("[STAFFCHANGE] " + error, "Red");
            ErrorLog("STAFFCHANGE", error);
        }
    }
}