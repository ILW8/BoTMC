const Bot = require(`${__dirname}/src/Bot.js`);
const { readFileSync } = require(`fs`);
const botConfig = JSON.parse(readFileSync(`${__dirname}/config/botConfig.json`));

const btmcBot = new Bot(botConfig);
btmcBot.login();