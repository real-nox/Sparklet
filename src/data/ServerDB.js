const { ErrorLog } = require("../handler/logsHanlder");
const { Print } = require("../handler/extraHandler");
const { Schema, model } = require("mongoose");

const ServerSc = new Schema(
    {
        guildID: {
            type: String,
            required: true
        },
        staffRID: {
            type: String,
            required: false
        },
        prefix: {
            type: String,
            required: false,
            default: '!'
        }
    }
);

let ServerC = model("ServerC", ServerSc);

async function setGuild(DB, guildId) {
    try {
        let res = await DB.create({ guildID: guildId });

        if (!res) return false;
        return true;
    } catch (err) {
        Print("[SERVERDB] " + err, "Red");
        ErrorLog("SERVERDB", err);
    }
}

async function getGuild(DB, guildId) {
    try {
        let res = await DB.findOne({ guildID: guildId });

        if (!res) return false
        return res;
    } catch (err) {
        Print("[SERVERDB] " + err, "Red");
        ErrorLog("SERVERDB", err);
    }
}

//Prefix change
async function getPrefix(DB, guildId) {
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

async function setPrefix(DB, guildId, prefix, found) {
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
async function getStaffR(DB, guildId) {
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

async function setStaffR(DB, guildId, staffRID) {
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

module.exports = { ServerC, setGuild, getGuild, getPrefix, setPrefix, setStaffR, getStaffR }