const RGLGame = require("../../classes/RGLFunction")
const { getGameOngoing } = require("../../data/RGLDB")
const { DB } = require("../../handler/dbHandler")

module.exports = {
    name: "rgl",
    async prerun(mg, client) {
        
        const guildID = mg.guild.id;
        const channelID = mg.channel.id;

        const Game = await getGameOngoing(DB, guildID, channelID)

        if (Game) return mg.reply("# There is an ongoing game!")

        await new RGLGame(client, mg, DB).Starter()
        
        //gameStart(DB, guildID, channelID)
        //mg.reply("starting")
    }
}