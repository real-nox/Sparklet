const { yellow } = require("colors")
const oracledb = require("oracledb")

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

let DB
async function LoaddDB() {
    try {
        oracledb.initOracleClient({
            libDir: "C:\\Users\\rayan\\Downloads\\instantclient-basic-windows.x64-19.29.0.0.0dbru\\instantclient_19_29"
        })

        await oracledb.createPool({
            user: 'system',
            password: 'Rayane10.',
            connectString: '127.0.0.1:1521/XE'
        })

        DB = await oracledb.getConnection()

        if (!DB) return Error("[ERROR] | Database ERROR")

        console.log(yellow("[DATABASE] : Database loaded"))
        return DB
    } catch (error) {
        Print("[ERROR] " + error, "Red")
    }
}

module.exports = { LoaddDB, DB }