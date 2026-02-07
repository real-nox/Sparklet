import { ErrorLog } from "../systems/LogSystem.js"
import { Print } from "../handler/extraHandler.js"

export async function getTCol(DB, guildID) {
    const TicketR = await DB.findOne({ guildId: guildID });

    if (!TicketR) return false;
    return TicketR;
}

export async function createTCol(DB, guildID, ticketConfig) {
    try {
        let { channel, category, transcription, staff } = ticketConfig;

        let res = await DB.create({ guildId: guildID, channelId: channel.id, categoryId: category.id, transcriptId: transcription.id, staffT: (staff.id || null) })
        if (res)
            return true;
    } catch (error) {
        Print("[TICKETCreateC] " + error, "Red");
        ErrorLog("TICKETCreateC", error);
    }
}