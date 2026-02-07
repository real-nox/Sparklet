import { time, TimestampStyles } from "discord.js";
import { Print } from "../../../handler/extraHandler.js";
import { ErrorLog } from "../../../systems/LogSystem.js";

export default {
    name: "earns",
    cooldown: 2000,
    async prerun(mg) {
        try {
            let userID = mg.author.id;
            let guildID = mg.guild.id;

            let addedS;
            let userECO = await getBalC(EcoC, userID, guildID);
            let cooldown = 60000 + Date.now();
            let balance = 50;

            if (!userECO) {
                addedS = await Earns(EcoC, userID, guildID, balance, cooldown, false);
                if (addedS)
                    return mg.reply(`Added ${balance} sparks to your balance!`);
            }

            if (userECO.balance == 100000) {
                return mg.reply("You have reached the maximum amount of sparks");
            }

            if (userECO.earnc && userECO.earnc > Date.now()) {
                const remaining = userECO.earnc - Date.now();
                const remainingT = Math.floor(userECO.earnc / 1000);

                return await mg.reply(`You have to wait for ${time(remainingT, TimestampStyles.RelativeTime)}`)
                    .then(async (msg) => {
                        setTimeout(async () => {
                            try {
                                await msg.delete();
                            } catch (err) {
                                console.warn("Message could'nt be deleted:", err.message);
                            }
                        }, remaining);
                    }).catch(console.error);
            }

            userECO.balance += balance;
            console.log(userECO.balance)
            addedS = await Earns(EcoC, userID, guildID, userECO.balance, cooldown, true);

            if (addedS) {
                return mg.reply(`Added ${balance} sparks to your balance!`);
            }
        } catch (error) {
            Print("[Earnscmd] " + error, "Red");
            ErrorLog("Earnscmd", error);
        }
    }
}