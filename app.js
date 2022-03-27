// Functions
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStr(len) {
    const charmap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|\\:;\"'<,>.?/";

    let str = "";
    for (let i = 0; i < len; i++) {
        str += charmap[randomNum(0, charmap.length - 1)];
    }
    return str;
}

function genLines(count, len = null) {
    let lines = [];
    for (let i = 0; i < count; i++) {
        const strLen = len || randomNum(3, 15);
        let line = randomStr(strLen);
        let lineObj = {
            str: line,
            speed: randomNum(1, 3)
        }
        lines.push(lineObj);
    }
    return lines;
}

const DEBUG = false;
function dbglog(str) {
    if (DEBUG) {
        console.log(str);
    }
}

// Variables
const INTERVAL_MS = 50;
let cmdColumns = process.stdout.columns;
let cmdLines = process.stdout.rows;
let gridSizeX = cmdColumns / 2 - 1;
let gridSizeY = cmdLines - 1;
let lines = genLines(gridSizeX);
let pos = [];

dbglog(`gridSizeX: ${gridSizeX} | gridSizeY: ${gridSizeY} | lines: ${lines.length}`);
setInterval(() => {
    if (cmdColumns !== process.stdout.columns || cmdLines !== process.stdout.rows) {
        cmdColumns = process.stdout.columns;
        cmdLines = process.stdout.rows;
        gridSizeX = cmdColumns / 2 - 1;
        gridSizeY = cmdLines - 1;
        lines = genLines(gridSizeX);
        pos = [];
        console.clear();
    }

    let finalStrings = [];
    for (let i = 0; i < lines.length; i++) {
        if (!pos[i]) pos[i] = randomNum(0, gridSizeY - lines[i].str.length);

        let str = `${" ".repeat(pos[i])}${lines[i].str}`
        if (str.length <= gridSizeY) {
            str = str + " ".repeat(gridSizeY - str.length)
        } else {
            let extra = str.substring(gridSizeY);
            // console.log(`${extra} (${extra.length}) | ll: ${lines[i].str.length}`);
            if (extra.length >= lines[i].str.length) pos[i] = 0;
            str = extra + str;
        }
        finalStrings.push(str);
        pos[i] += lines[i].speed;
        let speed = Math.round(lines[i].speed / 2);
        lines[i].str = lines[i].str.substring(1, lines[i].str.length - 1) + randomStr(2);
    }

    console.clear();
    dbglog("-".repeat(gridSizeX * 2));
    for (let i = 0; i < gridSizeY; i++) {
        let finalStr = finalStrings.map(str => str[i]).join(" ");
        console.log('\x1b[32m', finalStr);
    }
}, INTERVAL_MS);
