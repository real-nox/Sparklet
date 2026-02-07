import { Print } from "../handler/extraHandler.js"
import { DB } from "../handler/dbHandler.js";
import { ErrorLog } from "../systems/LogSystem.js";

export default class ServerDB {
    constructor(guildId) {
        this.DB = DB
        this.guildId = guildId
    }

    async setGuild() {
        try {
            const { error } = await this.DB.from("guilds")
                .insert({ guild_id: guildId });

            if (error) throw error;
            
            return;
        } catch (err) {
            Print("[SERVERDB] " + err, "Red");
            ErrorLog("SERVERDB", err);
        }
    }

    async getGuild() {
        try {
            const { data, error } = await DB.from("guilds")
                .select()
                .eq({ guild_id: guildId });

            if (error) throw error;

            return data;
        } catch (err) {
            Print("[SERVERDB] " + err, "Red");
            ErrorLog("SERVERDB", err);
        }
    }












    //Prefix change
    async getPrefix(DB, guildId) {
        try {
            await getGuild(DB, guildId)

            let result = await DB.findOne(({ guildID: guildId }));

            if (!result) return false;
            return result.prefix;
        } catch (err) {
            Print("[SERVERDB] " + err, "Red");
            ErrorLog("SERVERDB", err);
        }
    }

    async setPrefix(DB, guildId, prefix, found) {
        try {
            await getGuild(DB, guildId)

            if (!found)
                return await DB.create({ guildID: guildId, prefix: prefix });
            else {
                let Updated = await DB.updateOne({ guildID: guildId }, { $set: { prefix: prefix } });

                if (!Updated) return false;
                return true;
            }
        } catch (err) {
            Print("[SERVERDB] " + err, "Red");
            ErrorLog("SERVERDB", err);
        }
    }

    //Staff
    async getStaffR(DB, guildId) {
        try {
            await getGuild(DB, guildId);

            let result = await DB.findOne({ guildID: guildId });

            if (!result) return false;
            return result;
        } catch (err) {
            Print("[SERVERDB] " + err, "Red");
            ErrorLog("SERVERDB", err);
        }
    }

    async setStaffR(DB, guildId, staffRID) {
        try {
            await getGuild(DB, guildId);

            let Updated = await DB.updateOne({ guildID: guildId }, { $set: { staffRID: staffRID } });

            if (!Updated) return false;
            return true;
        } catch (err) {
            Print("[SERVERDB] " + err, "Red");
            ErrorLog("SERVERDB", err);
        }
    }
}