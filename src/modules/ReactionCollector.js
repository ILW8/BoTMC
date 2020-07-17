/**
 * Collects reactions and provides roles based on them
 */
module.exports = class ReactionCollector {
    /**
     * Creates new ReactionCollector from a JSON config file. Check ~/config/samples/reactionCollectorConfig_sample.json for a template
     * @param {Object} collectorConfig
     */
    constructor(collectorConfig) {
        Object.assign(this, collectorConfig);
    }

    setRole(reaction, user, add) {
        //guildID:channelID:messageID
        let messageIDTrace = `${reaction.message.guild.id}:${reaction.message.channel.id}:${reaction.message.id}`;
        //if message not listed, exit
        if (!this[messageIDTrace]) return;
        let roles = reaction.message.guild.member(user).roles,
            mappedRole = this[messageIDTrace][reaction.emoji.identifier];

        //if reaction not listed, remove reaction
        if (!mappedRole) {
            reaction.remove();
            return;
        }
        //an `!` is added to the end of roles that are add-only
        let addOnly = mappedRole.endsWith(`!`);
        let roleID = addOnly ? mappedRole.slice(0, -1) : mappedRole;

        //else add/remove role
        if (add) {
            roles.add(roleID).then(  //might want to disable logging once everyone floods in
                () => console.log(`added ${roleID} to ${user.username}#${user.discriminator}`)
            );
        } else if (!addOnly) {
            roles.remove(roleID).then(
                () => console.log(`removed ${roleID} from ${user.username}#${user.discriminator}`)
            );
        }
    }
}
