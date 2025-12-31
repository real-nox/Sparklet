const RGL_games = 
`create table if not exists RGL_games(
    gameID int auto_increment primary key,
    guildID int,
    channelID int
)`;

const RGL_T = 
`create table if not exists RGL_T(
	gameID int,
    participantsID int,
    winners int default 0,
    defeated int default 0,
    constraint fk_gameID foreign key (gameID) references RGL_games(gameID)
)`;

async function LoadRGL(DB) {
    const res1 = await DB.promise().query(RGL_games).then((res) => {
        if (!res) return print("[ERROR]")
    })
    console.log("res ", res1)
    if (res1) {}
    const res2 = await DB.promise().query(RGL_T)
}

module.exports = {LoadRGL}