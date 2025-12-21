const asciiTable = require("ascii-table");
const colors = require("colors")
const fs = require("fs");
const path = require("path");
const { Print } = require("./extraHandler");
let table = new asciiTable('Events')

table.setHeading("Name", "Execute")

function eventHandler(client) {
    try {
        const eventsFolder = path.join(__dirname, '../events');
        const eventsFiles = fs.readdirSync(eventsFolder).filter((file) => file.endsWith(".js"));

        for (const file of eventsFiles) {

            const filepath = path.join(eventsFolder, file)
            const event = require(filepath)
            if (!event.name) { 
                table.addRow(file, "Unloaded") 
            } else {
                if (event.once) {
                    client.once(event.name, (...args) => event.eventrun(client, ...args))
                } else {
                    client.on(event.name, (...args) => event.eventrun(client, ...args));
                }
                table.addRow(file, "Loaded")
            }
        }

        Print(table.toString(), "Red")
    } catch (err) {
        Print("[ERROR] " + err, "Red")
    }
}

module.exports = { eventHandler }