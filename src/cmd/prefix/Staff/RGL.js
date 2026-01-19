const { getRGameOngoing, deleteRGL, RGLGames } = require("../../../data/RGLDB");
const { ErrorLog } = require("../../../handler/logsHanlder");
const { Print } = require("../../../handler/extraHandler");
const RGLGame = require("../../../classes/RGLFunction");
const { EmbedBuilder } = require("discord.js");

let RGL;

module.exports = {
    name: "rgl",
    staff: true,
    async prerun(mg, client) {
        try {
            const guildID = mg.guild.id;
            const channelID = mg.channel.id;

            const args = mg.content.toLowerCase().split(" ");
            let cmdType = args[1];

            const ErrEmbed = new EmbedBuilder().setColor("Red");

            if (!cmdType) {
                ErrEmbed.setDescription("```Unknown command!```");
                return mg.reply({ embeds: [ErrEmbed] });
            }

            cmdType = cmdType.includes("-", 0) ? cmdType = cmdType.slice(1) : cmdType;

            let Game = await getRGameOngoing(RGLGames, guildID, channelID);

            switch (cmdType) {
                case "start":
                case "s":
                    let RGLConfig = { 
                        rounds : parseInt(args[2]), 
                        time : parseInt(args[3]), 
                        winnersC : parseInt(args[4])
                    }

                    if (Game) return mg.reply("# There is an ongoing game!");

                    if ((!RGLConfig.rounds || !RGLConfig.time) || ((RGLConfig.rounds > 20 || RGLConfig.rounds < 2) || (RGLConfig.time > 60 || RGLConfig.time < 10) || (RGLConfig.winnersC > 3 || RGLConfig.winnersC < 1))) {
                        ErrEmbed.setDescription("```Command format is incorrect !rgl -start <rounds> <duration in sec> <(winners) optional 3 by default>```");
                        return mg.reply({ embeds: [ErrEmbed] });
                    }

                    RGL = new RGLGame(client, mg, RGLConfig);
                    await RGL.Starter();

                    break;
                case "stop":
                case "end":
                    if (!Game) {
                        ErrEmbed.setDescription("```There is no ongoing game right now.```");
                        return mg.reply({ embeds: [ErrEmbed] });;
                    }

                    mg.reply("## Ending Game!")
                    if (RGL)
                        await RGL.GameStart(true);
                    else
                        await deleteRGL(RGLGames, guildID, channelID);
                    break;

                default:
                    ErrEmbed.setDescription("```Unknown command!```");
                    mg.reply({ embeds: [ErrEmbed] });;
                    break;
            }
        } catch (error) {
            Print("[RGL] " + error, "Red");
            ErrorLog("RGL", error);
        }
    }
}