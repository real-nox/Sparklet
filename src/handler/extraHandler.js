const { green, yellow, red, blue } = require("colors")

function Print(message, type = "Green") {
    if (type == "Green")
        console.log(green(message))
    if (type == "Yellow")
        console.log(yellow(message))
    if (type == "Red")
        console.log(red(message))
    if (type == "Blue")
        console.log(blue(message))
}

/*function ErrorLog(message) {
    const webURI = "https://discord.com/api/webhooks/1452352934515048702/FEBfy87QQkMpKqkU88VTGnHMGv6vqzNVPsvx_4P4lTbJ85qWBmgACOCRBs7i2uc1Tnhy"
}*/

module.exports = {Print}