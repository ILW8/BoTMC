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

const {ReactionCollector} = require('discord.js')
const {readFileSync} = require(`fs`);

// There is only one action for now, but actions can be expanded by adding functions to this enum
// This can also be moved into a separate file
const actions = {
    "SETROLE": (collector, triggered_event, u, option) => {
        triggered_event === "collect" ?
            collector.message.guild.members.fetch(u.id).then((guild_member) => {
                guild_member.roles.add(option["roleID"]).then(() => console.log("added role"))
            })
            :
            collector.message.guild.members.fetch(u.id).then((guild_member) => {
                guild_member.roles.remove(option["roleID"]).then(() => console.log("added role"))
            })
    },
}
Object.freeze(actions)


function attach_event_listeners(collector, emojiAction) {
    collector.on("collect", (r, u) => {
        let action = actions[emojiAction.action]
        if (action !== undefined) {
            action(collector, "collect", u, emojiAction.option)
        }
    })
    collector.on("remove", (r, u) => {
        let action = actions[emojiAction.action]
        if (action !== undefined) {
            action(collector, "remove", u, emojiAction.option)
        }
    })
}

function get_reactions_collector(client, monitored_message) {
    let currentGuild = client.guilds.resolve(monitored_message.guild_id)
    currentGuild.channels.resolve(
        monitored_message.chn_id).messages.fetch(
        monitored_message.msg_id).then(
        (channel_message) => {
            let react_filter = (identifier) => {
                return identifier.emoji.identifier in monitored_message.emoji_IDs
            }
            let collector = new ReactionCollector(channel_message, react_filter, {dispose: true});
            for (let emojiActionKey in monitored_message.emoji_IDs) {
                if (monitored_message.emoji_IDs.hasOwnProperty(emojiActionKey)) {
                    attach_event_listeners(collector, monitored_message.emoji_IDs.emojiActionKey)
                }
            }
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
