const { Client, ClientOptions } = require(`discord.js`);
const { loaddir } = require(`${__dirname}/util.js`);
/**
 * @typedef BotOptions
 * @property {string} token The bot's token
 * @property {Object} clientOptions The options for the Discord.js Client
 */

module.exports = class Bot extends Client
{
    /**
     * Creates a new instance of the Bot and loads the event handlers from ~/src/events
     * @param {BotOptions} config configuration for the Bot, including ClientOptions
     */
    constructor(config)
    {
        super(config["clientOptions"]);
        this.config = config;
        this.eventHandlers = undefined;
        this.loadHandlers();
    }

    /**
     * Loads event handler functions from the ~/src/events folder into their respective event listeners
     */
    loadHandlers()
    {
        this.eventHandlers = loaddir(`${__dirname}/events`, `.js`);
        for(let [name, func] of this.eventHandlers)
        {
            this.on(name, (...args) => func(...args, this));
        }
    }

    /**
     * Logs the bot in, initially triggering the 'ready' event
     */
    login(token)
    {
        super.login(token || this.config.token);
    }
}
