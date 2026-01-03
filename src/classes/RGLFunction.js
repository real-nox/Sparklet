const { gameStart } = require("../data/RGLDB");
const { delay, Print } = require("../handler/extraHandler");

let current = (Math.random() < 0.5) ? "Red" : "Green";

function NEXTLight() {
    return current = current === "Red" ? "Green" : "Red";
}

class RGLGame {

    constructor(client, mg, DB) {
        this.guildID = mg.guild.id;
        this.channelID = mg.channel.id;
        this.db = DB;
        this.mg = mg;

        this.client = client;

        //Game Settings
        this.rounds = 10;//
        this.timerRed;
        this.timerGreen;
        this.light;
    }

    TheLight() {
    }

    async Starter() {
        const started = true //await gameStart(this.db, this.guildID, this.channelID);

        if (started) {
            this.mg.reply("## Starting");
            Print("[RGL] : Startup", "Green");
            await this.Game();
        }
        this.mg.reply("Something unexpected happened")
    }

    async Game() {
        this.client.on("messageCreate", async (msg) => {
            if (this.mg.channel.id === msg.channel.id) {
                if (msg.author.bot) return;
                if (this.light === "Red") {
                    //To implement database defeated 
                    msg.react("☠️");
                } else if (this.light === "Green") {

                }
            }
        })

        for (let i = 0; i < this.rounds; i++) {
            this.light = NEXTLight();
            this.timerGreen = Math.floor(Math.random() * 15) + 5;
            this.timerRed = Math.floor(Math.random() * 9) + 5;

            this.mg.channel.send(`## Round ${i + 1}\nRed Time's set to ${this.timerRed} Green Time's set to ${this.timerGreen} and light is ${this.light}`);

            await delay(1)
            if (this.light == "Red") {
                this.mg.channel.send("## RED LIGHT");
                await delay(this.timerRed);
            } else {
                this.mg.channel.send("## GREEN LIGHT");
                await delay(this.timerGreen);
            }
        }
    }

    RedLight() {
        //Empty for now
    }

    GreenLight() {
        //Empty for now
    }
}

module.exports = RGLGame