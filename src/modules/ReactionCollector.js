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
        this.logger = logger.child({ moduleLabel: "ReactionCollector" });  // https://github.com/winstonjs/winston/pull/1598
        this.logger.defaultMeta["moduleLabel"] = "ReactionCollector"
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
            roles.add(roleID).then(
                () => this.logger.info(`Added ${roleID} to ${user.username}#${user.discriminator}`)
            );
        } else if (!addOnly) {
            roles.remove(roleID).then(
                () => this.logger.info(`Removed ${roleID} from ${user.username}#${user.discriminator}`)
            );
        }
    }
}
