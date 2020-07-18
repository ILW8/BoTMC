/**
 * Collects reactions and provides roles based on them
 */
module.exports = class ReactionCollector {
    /**
     * Creates new ReactionCollector from a JSON config file. Check ~/config/samples/reactionCollectorConfig_sample.json for a template
     * @param {Object} collectorConfig
     * @param logger
     */
    constructor(collectorConfig, logger) {
        this.logger = logger.child({moduleLabel: "ReactionCollector"});  // https://github.com/winstonjs/winston/pull/1598
        this.logger.defaultMeta["moduleLabel"] = "ReactionCollector"
        Object.assign(this, collectorConfig);
    }

    setRole(reaction, user, add) {
        //guildID:channelID:messageID
        let messageIDTrace = `${reaction.message.guild.id}:${reaction.message.channel.id}:${reaction.message.id}`;
        //if message not listed, exit
        if (!this[messageIDTrace]) return;

        let roles, mappedRole = undefined

        reaction.message.guild.members.fetch(user)
            .then(guildMember => {
                roles = guildMember.roles
                //split(":").slice(-1).pop() returns substring starting from the last colon in the string, or the whole
                //string if the string doesn't have a colon in it. To handle the fact that unicode emojis don't have an id.
                mappedRole = this[messageIDTrace][reaction.emoji.identifier.split(":").slice(-1).pop()];

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
                    roles.add(roleID).then(
                        () => this.logger.info(`Added ${roleID} to ${user.username}#${user.discriminator}`)
                    );
                } else if (!addOnly) {
                    roles.remove(roleID).then(
                        () => this.logger.info(`Removed ${roleID} from ${user.username}#${user.discriminator}`)
                    );
                }
            })
            .catch(error => {
                this.logger.warn(`Could not fetch ${user.username}#${user.discriminator} (${user.id}), skipping. ${error}`)
            })


    }
}
