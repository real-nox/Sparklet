const { ErrorLog } = require("../handler/logsHanlder");
const { Print } = require("../handler/extraHandler");
const { Schema, model } = require("mongoose");

const RGLGamesSC = new Schema(
    {
        guildID: {
            type: String,
            required: true
        },
        channelID: {
            type: String,
            required: true
        },
        ongoing: {
            type: Boolean,
            required: false
        }
    }
)
const RGLDSC = new Schema(
    {
        guildID: {
            type: String,
            required: true
        },
        channelID: {
            type: String,
            required: true
        },
        winners: []
    }
)

let RGLGames = model("RGLG", RGLGamesSC);
let RGLC = model("RGLC", RGLDSC);

async function gameRStart(data, guildId, channelId) {
    try {
        const ongame = await getRGameOngoing(data, guildId, channelId);

        if (!ongame) {
            let starting = await data.create({ guildID: guildId, channelID: channelId, ongoing: true })

            if (!starting) return false;
            return true;
        }
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function gameREnd(data, guildId, channelId) {
    try {
        let ongame = await getRGameOngoing(data, guildId, channelId);

        if (ongame) {

            let thegame = await data.updateOne({ guildID: guildId, channelID: channelId, ongoing: true }, { $set: { ongoing: false } })

            if (!thegame) return false;
            return true;
        }
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function saveRWinners(data, guildId, channelId, winnerId) {
    try {
        let ongame = await getRGameOngoing(RGLGames, guildId, channelId);

        if (ongame) {
            let resultat = await data.create({ guildID: guildId, channelID: channelId, winners: winnerId })

            if (!resultat) return false;
            return true;
        }
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function getRGameOngoing(data, guildId, channelId) {
    try {
        let resultat = await data.findOne({ guildID: guildId, channelID: channelId, ongoing: true })

        if (!resultat) return false;
        return resultat;
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function deleteRGL(data, guildId, channelId) {
    try {
        const ongame = await getRGameOngoing(data, guildId, channelId);

        if (!ongame)
            return false;

        let deletion = await data.deleteOne({ guildID: guildId, channelID: channelId, ongoing: true })

        if (!deletion) return false;
        return true;
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

module.exports = { RGLGames, RGLC, gameRStart, saveRWinners, gameREnd, getRGameOngoing, deleteRGL }