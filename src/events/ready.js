module.exports = (bot) =>
{
    console.log(`BoTMC is online! Logged in as ${bot.user.username}#${bot.user.discriminator} at ${bot.readyAt}`);

    const roleAssignmentsHandlers = require('../behaviours/roleAssignments')
    roleAssignmentsHandlers(bot)
}
