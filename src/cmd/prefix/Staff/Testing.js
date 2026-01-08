module.exports = {
    name : "test",
    cooldown : 10000,
    staff : true,
    prerun(mg) {
        mg.reply("cool")
    }
}