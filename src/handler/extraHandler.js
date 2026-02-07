import { config } from "dotenv"; config({ quiet: true })
import colors from "colors";

export function Print(message, type = "Green") {
    try {
        const { green, yellow, red, blue, cyan, grey } = colors
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

export async function delay(time) {
    time = time * 1000;
    return new Promise(reso => setTimeout(reso, time));
}