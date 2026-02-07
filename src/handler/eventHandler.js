import path from "path";
import fs from "fs";

import asciiTable from "ascii-table";

import { ErrorLog } from "../systems/LogSystem.js";
import { Print } from "./extraHandler.js";
import { fileURLToPath, pathToFileURL } from "url";

let table = new asciiTable('Events');

table.setHeading("Name", "Execute");

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export async function eventHandler(client) {
    try {
        const eventsFolder = path.join(__dirname, '../events');
        const eventsFiles = fs.readdirSync(eventsFolder).filter((file) => file.endsWith(".js"));

        for (const file of eventsFiles) {

            const filepath = path.join(eventsFolder, file);

            const module_ev = await import(pathToFileURL(filepath).href);
            const event = module_ev.default ?? module_ev

            if (!event.name) { 
                table.addRow(file, "Unloaded") ;
            } else {
                if (event.once) {
                    client.once(event.name, (...args) => event.eventrun(client, ...args));
                } else {
                    client.on(event.name, (...args) => event.eventrun(client, ...args));
                }
                client.events.set(event.name, event);
                table.addRow(file, "Loaded");
            }
        }

        Print(table.toString(), "Red");
    } catch (err) {
        Print("[ERROR] " + err, "Red");
        ErrorLog("EVENTS", err);
    }
}