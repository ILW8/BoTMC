/**
 * Called when a cached message has a reaction removed.
 * **Ensure the message is cached in the ready event for any reaction collecting**
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {Bot} bot
 */
module.exports = (bot, reaction, user) =>
{
    if(user.bot) return;
    //removes role if removed reaction
    bot.reactionCollector.setRole(reaction, user, false)
}
