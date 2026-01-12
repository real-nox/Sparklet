const { EmbedBuilder } = require("discord.js");
const { gameRStart, saveRWinners, gameREnd, deleteRGL, RGLGames, RGLC } = require("../data/RGLDB");
const { delay, Print } = require("../handler/extraHandler");
const { ErrorLog, EventLog } = require("../handler/logsHanlder");

let current = (Math.random() < 0.5) ? "Red" : "Green";

function NEXTLight() {
    return current = current === "Red" ? "Green" : "Red";
}

let participants = new Map();
let losers = new Map();

let i = 0;
let listener;

class RGLGame {

    constructor(client, mg, rounds, time, winnersC) {
        this.guildID = mg.guild.id;
        this.channelID = mg.channel.id;
        this.mg = mg;

        this.client = client;

        //Game Settings
        this.rounds = rounds;

        this.time = time;
        this.timerRed;
        this.timerGreen;

        this.winnerC = winnersC ? winnersC : 3
        this.light;
        this.gameon = false;
        this.list = true;
    }

    async Starter() {
        try {
            const started = await gameRStart(RGLGames, this.guildID, this.channelID);

            const ErrEmbed = new EmbedBuilder().setColor("Red");

            if (!started) {
                ErrEmbed.setDescription("```Something unexpected happened```")
                return this.mg.reply({ embeds: [ErrEmbed] });
            }

            this.mg.reply("## Starting");
            this.gameon = true;
            Print("[RGL] : Startup", "Green");

            EventLog(`RGL event has started : \n- **Server name :** \`${this.mg.guild.name}\`\n- **Server ID :** \`${this.guildID}\`\n- **Organisator :**${this.mg.author}`)

            //Event
            await this.GameStart();
        } catch (error) {
            Print("[RGLC] " + error, "Red");
            ErrorLog("RGLC", error);
        }
    }

    async GameStart(stop = false) {
        try {

            if (this.gameon == true) {

                if (!stop) {
                    listener = async (msg) => {
                        if (msg.channel.id === this.channelID) {
                            if (msg.author.bot) return;

                            if (!(msg.content.includes("rgl -end") && this.mg.author == msg.author)) {
                                if (this.light === "Red") {
                                    msg.react("🪦");
                                    this.RedLight(msg);
                                } else if (this.light === "Green") {
                                    this.GreenLight(msg);
                                }
                            }
                        }
                    }

                    this.client.on("messageCreate", listener);

                    for (i = 1; i <= this.rounds; i++) {

                        this.light = NEXTLight();
                        this.mg.channel.send(`## Round ${i}\n- Everyone can join!`);

                        await delay(1)
                        if (this.light == "Red") {
                            this.mg.channel.send({
                                embeds:
                                    [new EmbedBuilder().setTitle("RED LIGHT").setDescription("🔴 Red Light! Don't TALK or you'll be eliminated!!")]
                            });
                            
                            this.timerRed = Math.floor(Math.random() * this.time) + 3;
                            await delay(this.timerRed);

                            if (i < this.rounds) {
                                await this.WinnersLight();
                                await delay(1);
                            }
                        } else {
                            this.mg.channel.send({
                                embeds:
                                    [new EmbedBuilder().setTitle("GREEN LIGHT").setDescription("🟢 Green Light! TALK to win.")]
                            });

                            this.timerGreen = Math.floor(Math.random() * this.time) + 5;
                            await delay(this.timerGreen);

                            if (i < this.rounds) {
                                await this.WinnersLight();
                                await delay(1);
                            }
                        }
                    }
                }

                if (stop) i = this.rounds + 1;

                if (i > this.rounds) {
                    this.list = false;
                    if (listener) this.client.off("messageCreate", listener);
                    await this.WinnersLight();
                    delay(2);
                    this.gameon = false;
                    return await this.GameEnd();
                }
            }
        } catch (error) {
            Print("[RGLC] " + error, "Red");
            ErrorLog("RGLC", error);
        }
    }

    RedLight(msg) {
        try {
            if (!losers.has(msg.author.id)) {
                if (participants.has(msg.author.id)) {
                    participants.delete(msg.author.id)
                }

                losers.set(msg.author.id, 0);
            }
        } catch (error) {
            Print("[RGLC] " + error, "Red");
            ErrorLog("RGLC", error);
        }
    }

    GreenLight(msg) {
        try {
            if (!losers.has(msg.author.id)) {
                if (!participants.has(msg.author.id)) {
                    participants.set(msg.author.id, 1);
                } else {
                    let count = participants.get(msg.author.id);
                    participants.set(msg.author.id, count + 1);
                }
            }
        } catch (error) {
            Print("[RGLC] " + error, "Red");
            ErrorLog("RGLC", error);
        }
    }

    async WinnersLight() {
        try {
            if (!this.list) {
                if (participants.size === 0 && losers.size === 0) {
                    await deleteRGL(RGLGames, this.guildID, this.channelID)
                    return this.mg.channel.send("## 😞 No one participated!");
                }
            }

            if (participants.size > 0) {
                let participantsArray = [...participants.entries()];
                participantsArray.sort((a, b) => b[1] - a[1]);

                let winnersC;
                if (!this.list) {
                    winnersC = Math.min(participants.size, this.winnerC);
                    let medals = ["🥇", "🥈", "🥉"]
                    const EmbedWin = new EmbedBuilder()
                        .setColor("Gold").setTitle("👑 Winners 👑");

                    let topwinners = participantsArray.slice(0, winnersC).map(([id, count]) => ({ id, count }));

                    topwinners.forEach(async ({ id, count }, index) => {
                        EmbedWin.addFields({ name: " ", value: `${medals[index]} : <@${id}> \`${count}\`` });
                        await saveRWinners(RGLC, this.guildID, this.channelID, id);
                    });

                    for (const { id } of topwinners) participants.delete(id);

                    this.mg.channel.send({ embeds: [EmbedWin] });
                }
                if (participants.size > winnersC || this.list) {
                    const EmbedParti = new EmbedBuilder()
                        .setColor("Green").setTitle("🛡️ Survivors 🛡️");

                    let partiMSG = participantsArray.slice(winnersC || 0).map((s, i) => `${i + 1} <@${s[0]}> : \`${s[1]}\``).join("\n")

                    EmbedParti.addFields({ name: "", value: partiMSG });

                    this.mg.channel.send({ embeds: [EmbedParti] });

                    participantsArray = [];
                }
            }

            if (losers.size > 0) {
                const EmbedLoser = new EmbedBuilder()
                    .setColor("DarkButNotBlack").setTitle("🪦 Eliminated 🪦")

                let losersArrayTXT = [...losers.entries()].map((s, i) => `${i + 1} <@${s[0]}> : \`${s[1]}\``).join("\n")
                EmbedLoser.addFields({ name: "", value: losersArrayTXT });

                this.mg.channel.send({ embeds: [EmbedLoser] });
                losersArrayTXT = [];
            }
        } catch (error) {
            Print("[RGLC] " + error, "Red");
            ErrorLog("RGLC", error);
        }
    }

    async GameEnd() {
        try {
            await gameREnd(RGLGames, this.guildID, this.channelID);

            if (losers.size > 0) losers.clear();
            if (participants.size > 0 ) participants.clear();

            Print("[RGL] : ended", "Grey")
        } catch (error) {
            Print("[RGLC] " + error, "Red");
            ErrorLog("RGLC", error);
        }
    }
}

module.exports = RGLGame