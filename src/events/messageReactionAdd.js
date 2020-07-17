const { MessageReaction, User } = require(`discord.js`);
const Bot = require(`${__dirname}/../Bot.js`);
/**
 * Called when a cached message recieves a reaction.
 * **Ensure the message is cached in the ready event for any reaction collecting**
 * @param {MessageReaction} reaction 
 * @param {User} user 
 * @param {Bot} bot 
 */
module.exports = (reaction, user, bot) =>
{
    if(user.bot) return;
    //adds role if added reaction
    bot.reactionCollector.setRole(reaction, user, true)
}