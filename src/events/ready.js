const { Client } = require(`discord.js`);

const { loadToObject } = require(`${__dirname}/../util.js`);

/**
 * Called when the Bot first goes online. Call a lot of setup here.
 * @param {Client} bot 
 */
module.exports = async (bot) =>
{
    //on awake message
    console.log(`BoTMC is online! Logged in as ${bot.user.username}#${bot.user.discriminator} at ${bot.readyAt.toTimeString()}`);

    //loads reactionCollectorConfig to cache necessary messages
    for(messageTrace in loadToObject(`${__dirname}/../../config/reactionCollectorConfig.json`))
    {
        let split = messageTrace.split(`:`);
        await bot.guilds.resolve(split[0]).channels.resolve(split[1]).messages.fetch(split[2]);
    }
}