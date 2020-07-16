//placeholder for actual role assignment functions placed here

/**
 * @typedef MonitoredMessage
 * @property {string} guild_id The guild ID
 * @property {string} chn_id The channel ID
 * @property {string} msg_id The message ID
 * @property {Array.<string>} emoji_IDs IDs of the reactions (emojis) to be monitored
 */

const {ReactionCollector} = require('discord.js')
const {readFileSync} = require(`fs`);

let collectors = {}

function get_reactions_collector(client, monitored_message) {
    client.guilds.resolve(
        monitored_message.guild_id).channels.resolve(
        monitored_message.chn_id).messages.fetch(
        monitored_message.msg_id).then(
        (message) => {
            console.log(message);
            let react_filter = (emoji_ID) => monitored_message.emoji_IDs.includes(emoji_ID)
            return new ReactionCollector(message, react_filter);
        },
        (e) => console.log(`Could not get message ${monitored_message.msg_id} from guild ${monitored_message.guild_id}, channel ${monitored_message.chn_id}: ${e}`)
    );
}

function create_collectors(client)
{
    collectors = {}
    let monitoredMessages = JSON.parse(readFileSync(`${__dirname}/../../config/monitoredMessages.json`, 'utf8'))
    for (let message of monitoredMessages)
    {
        console.log(message.msg_id)
        collectors[message.msg_id] = get_reactions_collector(client, message);
    }
    return collectors;
}

module.exports.create_collectors = create_collectors
