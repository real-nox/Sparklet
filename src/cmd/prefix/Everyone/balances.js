import { Print } from "../../../handler/extraHandler.js";
import { ErrorLog } from "../../../systems/LogSystem.js";

export default {
    name: "bal",
    async prerun(mg) {
        try {
            let userID = mg.author.id;
            let guildID = mg.guild.id;

            let { balance } = await getBalC(EcoC, userID, guildID);

            return mg.reply(`You have ${balance}`);
        } catch (error) {
            Print("[Balcmd] " + error, "Red");
            ErrorLog("Balcmd", error);
        }
    }
}