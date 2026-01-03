const { Print, ErrorLog } = require("../handler/extraHandler");

const RGL_games =
    `create table if not exists RGL_games(
    gameID int auto_increment primary key,
    guildID varchar(250) NOT NULL,
    channelID varchar(250) NOT NULL,
    ongoing boolean default false
)`;

const RGL_T =
    `create table if not exists RGL_T(
	gameID int,
    participantsID varchar(250) NOT NULL,
    winners varchar(250) default 0 NOT NULL,
    defeated varchar(250) default 0 NOT NULL,
    constraint fk_gameID foreign key (gameID) references RGL_games(gameID)
)`;

async function LoadRGL(DB) {
    try {
        await DB.promise().query(RGL_games).then((res) => {
            if (!res) return print("[ERROR]");
        });
        await DB.promise().query(RGL_T).then((res) => {
            if (!res) return print("[ERROR]");
        });
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function gameStart(data, guildID, channelID) {
    try {
        const ongame = getGameOngoing(data, guildID, channelID);

        if (ongame) return console.log("there is no an ongoing game");

        const [starting] = await data.promise().query(
            `Insert into rgl_games (guildID, channelID, ongoing) values (?,?,?)`,
            [guildID, channelID, true]
        );

        if (starting) return true;
        return false;

    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function gameEnd(data, guildID, channelID) {
    try {
        if (!(guildID && channelID)) return null;

        const ongame = getGameOngoing(data, guildID, channelID);

        if (ongame) {

            let [thegame] = await data.promise().query(
                `delete from rgl_games where (guildID=? && channelID=? && ongoing = true)`,
                [guildID, channelID]
            );

            if (thegame) return true;
            return false;
        }
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

async function getGameOngoing(data, guildID, channelID) {
    try {
        if (!(guildID && channelID)) return null;

        let [resultat] = await data.promise().query(
            `select * from rgl_games where (guildID=? && channelID=? && ongoing = true)`,
            [guildID, channelID]
        );

        if (resultat.length == 0) return false;
        return true;
    } catch (err) {
        Print("[RGLDB] " + err, "Red");
        ErrorLog("RGLDB", err);
    }
}

module.exports = { LoadRGL, gameStart, gameEnd, getGameOngoing }