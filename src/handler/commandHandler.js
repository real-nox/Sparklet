const { REST, Routes } = require("discord.js")
const { config } = require("dotenv")
const fs = require("fs")
const path = require("path")
config({ quiet: true })

const cmds = []
const rest = new REST().setToken(process.env.TOKEN)

function commandHandler(client) {
    const cmdFolder = path.join(__dirname, "../cmd")
    const cmdFiles = fs.readdirSync(cmdFolder).filter((file) => file.endsWith(".js"))

    for (file of cmdFiles) {
        const filepath = path.join(cmdFolder, file)
        const cmd = require(filepath)
        if ('data' in cmd && 'execute' in cmd) {
            cmds.push(cmd.data.toJSON())
        } else {
            console.log("no cmd recognized")
        }
    }
}

(async () => {
    try {
        console.log(`refreshing ${cmds.length} application commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(1171011713928278076), { body: cmds })
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})
module.exports = { commandHandler }