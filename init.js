const Bot = require(`${__dirname}/src/Bot.js`);
const { readFileSync } = require(`fs`);

//Loads botConfig from ~/config/botConfig.json, so make sure to create that folder and file according to the typedef in Bot.js
const botConfig = JSON.parse(readFileSync(`${__dirname}/config/botConfig.json`));

//Creates a new Bot instance
const btmcBot = new Bot(botConfig);
btmcBot.login();