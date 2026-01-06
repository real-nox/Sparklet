const { config } = require("dotenv"); config({ quiet: true })
const { green, yellow, red, blue, cyan, grey } = require("colors");

function Print(message, type = "Green") {
    try {
        if (type == "Green")
            console.log(green(message))
        if (type == "Yellow")
            console.log(yellow(message))
        if (type == "Red")
            console.log(red(message))
        if (type == "Blue")
            console.log(blue(message))
        if (type == "Cyan")
            console.log(cyan(message))
        if (type == "Grey")
            console.log(grey(message))
    } catch (err) {
        console.log(red(message))
    }
}

async function delay(time) {
    time = time*1000;
    return new Promise(reso => setTimeout(reso, time));
}

module.exports = { Print, delay }