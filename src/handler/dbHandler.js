const { config } = require("dotenv");
const { createConnection } = require("mysql2")
const { ErrorLog, Print } = require("./extraHandler");
const { LoadRGL } = require("../data/RGLDB");
config({ quiet: true });

let DB;

async function LoaddDB() {
    try {

        DB = createConnection({
            host: process.env.host,
            user: process.env.user,
            port: process.env.port,
            database: process.env.database,
            password: process.env.password,
        });

        DB.connect(function (err) {
            if (err) throw err;
            Print("[DATABASE] Connected to the MySQL database!", "Cyan")
        });

        LoadRGL(DB)
    } catch (error) {
        Print("[ERROR] " + error, "Red");
        ErrorLog("DATABASE", error);
    }
}

module.exports = { LoaddDB, DB }