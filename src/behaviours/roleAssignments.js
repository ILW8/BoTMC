//placeholder for actual role assignment functions placed here

/**
 * @typedef EmojiAction
 * @property {Object.<string, string>} identifier Discord emoji identifier
 * https://discord.js.org/#/docs/main/stable/class/Emoji?scrollTo=identifier
 *
 * @property {Object.<string, string>} action Action to take when this emoji is added/removed
 * @property {Object.<string, Object>} option Options related to action
 */

/**
 * @typedef MonitoredMessage
 * @property {string} guild_id The guild ID
 * @property {string} chn_id The channel ID
 * @property {string} msg_id The message ID
 * @property {Object.<string, EmojiAction>} emoji_IDs Object emoji_id: EmojiAction
 */

// TODO: don't need to use reactioncollector when only monitoring a single server. Monitor every single react-add event.
const {ReactionCollector} = require('discord.js')
const {readFileSync} = require(`fs`);


function get_reactions_collector(client, monitored_message) {
    let currentGuild = client.guilds.resolve(monitored_message.guild_id)
    currentGuild.channels.resolve(
        monitored_message.chn_id).messages.fetch(
        monitored_message.msg_id).then(
        (channel_message) => {
            // let react_filter = () => {
            //     return true
            // }
            let react_filter = (identifier) => {
                // console.log(identifier);
                return identifier.emoji.identifier in monitored_message.emoji_IDs
            }
            let collector = new ReactionCollector(channel_message, react_filter, {dispose: true});
            // TODO: make a function to attach appropriate action to a reactions collector instead of this mess
            collector.on("collect", (r, u) => {
                let current_EmojiAction = monitored_message.emoji_IDs[r.emoji.identifier]
                if (current_EmojiAction.action === "setRole") {
                    currentGuild.members.fetch(u.id).then((member_to_modify) => {
                        // console.log(member_to_modify.roles)
                        member_to_modify.roles.add(current_EmojiAction.option.roleID).then(() => {
                            console.log(`Added role \
${currentGuild.roles.resolve(current_EmojiAction.option.roleID).name} to \
${member_to_modify.user.username}#${member_to_modify.user.discriminator}!`)
                        })
                    })
                }
            })
            collector.on("remove", (r, u) => {
                let current_EmojiAction = monitored_message.emoji_IDs[r.emoji.identifier]
                if (current_EmojiAction.action === "setRole") {
                    currentGuild.members.fetch(u.id).then((member_to_modify) => {
                        member_to_modify.roles.remove(current_EmojiAction.option.roleID).then(() => {
                            console.log(`Removed role \
${currentGuild.roles.resolve(current_EmojiAction.option.roleID).name} from \
${member_to_modify.user.username}#${member_to_modify.user.discriminator}!`)
                        })
                    })
                }
            })
            return collector;
        },
        (e) => console.log(`Could not get message ${monitored_message.msg_id} from guild ${monitored_message.guild_id}, channel ${monitored_message.chn_id}: ${e}`)
    );
}

function create_collectors(client) {
    let collectors = {}
    let monitoredMessages = JSON.parse(readFileSync(`${__dirname}/../../config/monitoredMessages.json`, 'utf8'))
    for (let message of monitoredMessages) {
        console.log(message.msg_id)
        collectors[message.msg_id] = get_reactions_collector(client, message);
    }
    return collectors;
}

module.exports.create_collectors = create_collectors
