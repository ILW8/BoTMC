const { Message } = require(`discord.js`);
const Bot = require(`${__dirname}/../Bot`);

/**
 * Called whenever the Bot receives a message, commands are handled here.
 * @param {Message} msg
 * @param {Bot} bot
 */
module.exports = (bot, msg) =>
{
    // console.log(msg.content); //temporary echo to console
    bot.messageCollector.logMessage(msg)
    bot.messageFilter.filterMessage(msg)
}
