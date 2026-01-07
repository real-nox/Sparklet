const { config } = require("dotenv");
const { createConnection } = require("mysql2")
const { Print } = require("./extraHandler");
const { LoadRGL } = require("../data/RGLDB");
const { ErrorLog } = require("./logsHanlder");
const { LoadServer } = require("../data/ServerDB");
config({ quiet: true });

let DB = createConnection({
    host: process.env.host,
    user: process.env.user,
    port: process.env.port,
    database: process.env.database,
    password: process.env.password,
});

async function LoaddDB() {
    try {

        DB.connect(function (err) {
            if (err) throw err;
            Print("[DATABASE] Connected to the MySQL database!", "Cyan")
        });

        await LoadRGL(DB)
        await LoadServer(DB)
        return DB;
    } catch (error) {
        Print("[ERROR] " + error, "Red");
        ErrorLog("DATABASE", error);
    }
}

module.exports = { LoaddDB, DB }