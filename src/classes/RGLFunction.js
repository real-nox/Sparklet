const { gameStart } = require("../data/RGLDB");
const { delay, Print } = require("../handler/extraHandler");

let current = (Math.random() < 0.5) ? "Red" : "Green";

function NEXTLight() {
    return current = current === "Red" ? "Green" : "Red";
}

let participants = new Map();
let losers = new Map();

let i = 0;

class RGLGame {

    constructor(client, mg, DB, count) {
        this.guildID = mg.guild.id;
        this.channelID = mg.channel.id;
        this.db = DB;
        this.mg = mg;

        this.client = client;

        //Game Settings
        this.rounds = 3;//
        this.timerRed;
        this.timerGreen;
        this.winnerC = (!count) ? 3 : count
        this.light;
        this.gameon = false;
    }

    async Starter() {
        const started = true //await gameStart(this.db, this.guildID, this.channelID);

        if (!started)
            return this.mg.reply("Something unexpected happened");

        this.mg.reply("## Starting");
        this.gameon = true;
        Print("[RGL] : Startup", "Green");

        await this.GameStart();
    }

    async GameStart() {

        if (this.gameon == true) {
            const listener = async (msg) => {
                if (this.mg.channel.id === msg.channel.id) {
                    if (msg.author.bot) return;
                    if (this.light === "Red") {
                        msg.react("☠️");
                        this.RedLight(msg);
                    } else if (this.light === "Green") {
                        this.GreenLight(msg);
                    }
                }
            }

            this.client.on("messageCreate", listener);

            for (i = 0; i < this.rounds; i++) {

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

            if (i == this.rounds) {
                this.WinnersLight();
                this.gameon = false;
                this.client.off("messageCreate", listener)
                return this.GameEnd()
            }
        }
    }

    RedLight(msg) {
        if (!losers.has(msg.author.id)) {
            if (participants.has(msg.author.id)) {
                participants.delete(msg.author.id)
            }

            losers.set(msg.author.id, 0);
        }
    }

    GreenLight(msg) {
        if (!losers.has(msg.author.id)) {
            if (!participants.has(msg.author.id)) {
                participants.set(msg.author.id, 1);
            }
            let count = participants.get(msg.author.id);
            participants.set(msg.author.id, count++);
        }
    }

    WinnersLight() {
        if (participants.size === 0 && losers.size === 0) 
            return this.mg.channel.send("## 😞 No one participated!");

        if (participants.size > 0) {
            
        }
        this.mg.channel.send("Winners are!!!!")

        participants.forEach((points, participant) => {
            this.mg.channel.send(`<@${participant}> | points : ${points}`);
        });

        losers.forEach((points, loser) => {
            this.mg.channel.send(`${loser} | ${points}`)
        })
    }

    GameEnd() {
        //Data to save
        //clearing maps

        losers.clear();
        participants.clear();
        winners.clear();

        Print("[RGL] : ended", "Grey")
    }

}

module.exports = RGLGame