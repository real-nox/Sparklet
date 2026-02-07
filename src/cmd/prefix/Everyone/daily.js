import { time, TimestampStyles } from "discord.js"
import { Print } from "../../../handler/extraHandler.js"
import { ErrorLog } from "../../../systems/LogSystem.js";

export default {
    name: "dailys",
    cooldown: 2000,
    async prerun(mg) {
        try {
            let userID = mg.author.id;
            let guildID = mg.guild.id;

            let addedS;
            let userECO = await getBalC(EcoC, userID, guildID);
            let cooldown24h = 86400 * 1000 + Date.now();

            let bal = 100

            if (!userECO) {
                addedS = await Dailys(EcoC, userID, guildID, bal, cooldown24h, false);
                if (addedS)
                    return mg.reply(`Added ${bal} sparks to your balance!`);
            }

            if (userECO.balance === 100000) {
                return mg.reply("You are too rich...");
            }

            if (userECO.dailyc && userECO.dailyc > Date.now()) {
                let remaining = userECO.dailyc - Date.now();
                let remainingT = Math.floor(userECO.dailyc / 1000);

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

            userECO.balance += bal;
            addedS = await Dailys(EcoC, userID, guildID, userECO.balance, cooldown24h, true)

            if (addedS) {
                return mg.reply(`Daily : ${bal} has been added to your balance`);
            }
        } catch (error) {
            Print("[DAILYcmd] " + error, "Red");
            ErrorLog("DAILYcmd", error);
        }
    }
}