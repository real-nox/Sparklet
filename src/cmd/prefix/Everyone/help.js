import { EmbedBuilder } from "discord.js"

export default {
    name: "help",
    async prerun(mg) {
        const helpEmbed = new EmbedBuilder()
            .setTitle("Commands List - Help")
        await mg.reply({ embeds: [helpEmbed] })
    }
}