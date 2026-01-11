const { EmbedBuilder, TimestampStyles, time } = require("discord.js");
const { getBalC, Coinflips } = require("../../../data/EconomyDB");
const { DB } = require("../../../handler/dbHandler");
const { Print } = require("../../../handler/extraHandler");
const { ErrorLog } = require("../../../handler/logsHanlder");

module.exports = {
    name: "coinflip",
    cooldown: 2000,
    async prerun(mg) {
        try {
            let userID = mg.author.id;
            let guildID = mg.guild.id;

            let cooldown = 600000 + Date.now();

            let price = parseInt((mg.content.split(" "))[1]);

            if (!price)
                return mg.reply("Set your price between 50 and 2000 sparks");

            let userECO = await getBalC(DB, userID, guildID);

            if (!userECO)
                return mg.reply("you have nothing..");

            if (price > 2000 || price < 50)
                return mg.reply("You must put your price between 50 and 2000 sparks");

            if (userECO && userECO.balance == 100000)
                return mg.reply("You are rich to use this command");

            if (userECO && userECO.balance < price)
                return mg.reply("You don't have enough sparks for this bid");

            if (userECO.coinfc && userECO.coinfc > Date.now()) {
                let remaining = userECO.coinfc - Date.now();
                let remainingT = Math.floor(userECO.coinfc / 1000);

                return mg.reply(`wait for ${time(remainingT, TimestampStyles.RelativeTime)}`)
                    .then(async (msg) => {
                        setTimeout(async () => {
                            try {
                                await msg.delete();
                            } catch (err) {
                                console.warn("Message could'nt be deleted:", err.message);
                            }
                        }, remaining);
                    });
            }
            let luck = Math.floor(Math.random() * 100)
            let bal;
            let des;
            const cfembed = new EmbedBuilder()

            if (luck > 50) {
                bal = userECO.balance + price;
                des = `Lucky ${price} has been added to your balance`;
                cfembed.setColor("Yellow");
            } else {
                bal = userECO.balance - price;
                des = `unlucky ${price} has been removed from your balance`;
                cfembed.setColor("DarkRed");

            }
            let res = await Coinflips(DB, userID, guildID, bal, cooldown)

            if (res)
                cfembed.setDescription(`${des}`)
            return mg.reply({ embeds: [cfembed] })
        } catch (error) {
            Print("[CFcmd] " + error, "Red");
            ErrorLog("CFcmd", error);
        }
    }
}