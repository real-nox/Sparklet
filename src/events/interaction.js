import { Client, MessageFlags, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Print } from "../handler/extraHandler.js";
import { TicketSystem } from "../systems/TicketSystem.js";
import { ErrorLog } from "../systems/LogSystem.js";

export default {
    name: "interactionCreate",

    /**
    * @param {import("discord.js").Interaction} interaction;
    * @param {import("discord.js").Client} client;
    */
    async eventrun(client, interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const { commandName } = interaction;

                const command = client.commands.get(commandName);

                //Cooldown
                if (command.cooldown) {
                    let cooldownUntil = client.cooldowns.get(`${command.name}-${interaction.user.id}`);
                    if (cooldownUntil && cooldownUntil > Date.now()) {
                        return await interaction.reply({ content: `Command is on cooldown for ${Math.ceil((cooldownUntil - Date.now()) / 1000)} secs`, flags: MessageFlags.Ephemeral })
                    }

                    client.cooldowns.set(`${command.name}-${interaction.user.id}`, new Date().valueOf() + command.cooldown);
                }

                //Owner
                if (command.owner)
                    if (interaction.user.id != "432592303450882064") return;

                //Admin
                if (command.admin)
                    if (!interaction.member.permissions.has("Administrator")) {
                        const permbed = new EmbedBuilder()
                            .setDescription("```You are not an admin to use this command!```").setColor("Red");
                        return interaction.reply({ embeds: [permbed], flags: MessageFlags.Ephemeral });
                    }

                //Staff
                if (command.staff)
                    if (!interaction.member.permissions.has("Administrator") && !interaction.member.permissions.has("ManageMessages") && !interaction.member.roles.cache.has((await getStaffR(DB, interaction.guild.id))[0].staffRID || '0')) {
                        const permbed = new EmbedBuilder()
                            .setDescription("```You are not a staff to use this command!```").setColor("Red");
                        return interaction.reply({ embeds: [permbed], flags: MessageFlags.Ephemeral });
                    }

                command.execute(interaction, client);
            }

            if (interaction.isButton()) {

                //Open T btn
                if (interaction.customId === `ticket-${interaction.guild.id}-${interaction.channel.id}`) {
                    const TicketC = new TicketSystem(interaction, client);
                    await TicketC.openT();
                }

                if (interaction.customId === `closeT-${interaction.channel.id}-${interaction.member.user.id}`) {
                    await interaction.message.edit({ components: [] })

                    const close = new ButtonBuilder()
                        .setLabel("Close")
                        .setCustomId(`Tclose-${interaction.channel.id}-${interaction.member.user.id}`)
                        .setStyle(ButtonStyle.Danger)

                    const cancel = new ButtonBuilder()
                        .setLabel("Cancel")
                        .setCustomId(`cancelT-${interaction.channel.id}-${interaction.member.user.id}`)
                        .setStyle(ButtonStyle.Secondary)

                    await interaction.message.reply({
                        embeds: [new EmbedBuilder().setDescription("Are you sure you want to close this ticket?")],
                        components: [new ActionRowBuilder().setComponents(close, cancel)]
                    })
                }

                if (interaction.customId === `cancelT-${interaction.channel.id}-${interaction.member.user.id}`) {
                    console.log(interaction.message)
                    const messageold = interaction.channel.messages.fetch(interaction.message.reference.messageId)

                    const closeBtn = new ButtonBuilder()
                        .setCustomId(`closeT-${interaction.channel.id}-${interaction.member.user.id}`)
                        .setEmoji("🔒")
                        .setLabel("Close")
                        .setStyle(ButtonStyle.Danger);

                    const claimBtn = new ButtonBuilder()
                        .setCustomId(`claimT-${interaction.channel.id}-${interaction.member.user.id}`)
                        .setEmoji("📫")
                        .setLabel("Claim")
                        .setStyle(ButtonStyle.Primary);

                    (await messageold).edit({ components: [new ActionRowBuilder().setComponents(closeBtn, claimBtn)] })
                    await interaction.message.delete()
                }

                if (interaction.customId === `claimT-${interaction.channel.id}-${interaction.member.user.id}`) {
                    await new TicketSystem(interaction, client).claimT()
                }

                if (interaction.customId === `Tclose-${interaction.channel.id}-${interaction.member.user.id}`) {

                }

            }
        } catch (error) {
            Print("[ERROR] " + error, "Red");
            ErrorLog("Interaction", error);
        }
    }
}