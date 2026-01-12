const { ErrorLog } = require("../handler/logsHanlder");
const { Print } = require("../handler/extraHandler");
const { Schema, model } = require("mongoose");

const EconomySchema = new Schema(
    {
        userID: {
            type: String,
            required: true
        },
        guildID: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            required: false
        },
        earnc: {
            type: Number,
            required: false
        },
        dailyc: {
            type: Number,
            required: false
        },
        coinfc: {
            type: Number,
            required: false
        }
    }
);

let EcoC = model("eco", EconomySchema);

async function getBalC(DB, userId, guildId) {
    try {
        let data = await DB.findOne({ userID: userId, guildID: guildId })

        if (!data || !data.balance)
            return false;

        const {
            balance = 0,
            earnc = 0,
            dailyc = 0,
            coinfc = 0
        } = data;

        return { balance, earnc, dailyc, coinfc };
    } catch (error) {
        Print("[Getbal]", error, "Red");
        ErrorLog("Getbal", error);
    }
}

//Earn Sparks
async function Earns(DB, userId, guildId, bal, cooldown, found) {
    try {

        if (!found)
            return await DB.create({ userID: userId, guildID: guildId, balance: bal, earnc: cooldown });

        return await DB.updateOne({ userID: userId, guildID: guildId }, { $set: { balance: bal, earnc: cooldown } });
    } catch (error) {
        Print("[EARNCDB] " + error, "Red");
        ErrorLog("EARNCDB", error);
    }
}

//Daily Sparks
async function Dailys(DB, userId, guildId, bal, cooldown, found) {
    try {
        if (!found)
            return await DB.create({ userID: userId, guildID: guildId, balance: bal, dailyc: cooldown });

        return await DB.updateOne({ userID: userId, guildID: guildId }, { $set: { balance: bal, dailyc: cooldown } });
    } catch (error) {
        Print("[DAILYSDB] " + error, "Red");
        ErrorLog("DAILYSDB", error);
    }
}

//CF sparks
async function Coinflips(DB, userId, guildId, bal, cooldown) {
    try {
        return await DB.updateOne({ userID: userId, guildID: guildId }, { $set: { balance: bal, coinfc: cooldown } });
    } catch (error) {
        Print("[CFDB] " + error, "Red");
        ErrorLog("CFDB", error);
    }
}

module.exports = { EcoC, getBalC, Earns, Dailys, Coinflips };