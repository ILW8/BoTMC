const { Client } = require(`discord.js`);
const { loaddir, loadToObject } = require(`${__dirname}/util.js`);
const { Logger, ReactionCollector, MessageCollector, MessageFilter } = loaddir(`${__dirname}/modules`, `.js`);

/**
 * An extension to Discord.js Client with modules loaded from ~/src/modules
 */
module.exports = class Bot extends Client
{
    /**
     * Creates a new instance of the Bot and loads the event handlers from ~/src/events
     * @param {BotOptions} config configuration for the Bot, including ClientOptions
     */
    constructor(config)
    {
        super(config[`clientOptions`]);
        this.config = config;
        this.eventHandlers = undefined;
        this.logging = new Logger;
        this.logger = this.logging.getDefaultLogger()
        this.reactionCollector = new ReactionCollector(loadToObject(`${__dirname}/../config/reactionCollectorConfig.json`), this.logger);
        this.messageCollector = new MessageCollector(this)
        this.messageFilter = new MessageFilter(this, `${__dirname}/../config/contentFilters/`)
        this.loadHandlers();
    }

    /**
     * Loads event handler functions from the ~/src/events folder into their respective event listeners
     */
    loadHandlers()
    {
        this.eventHandlers = loaddir(`${__dirname}/events`, `.js`);
        for(let event in this.eventHandlers)
        {
            this.on(event, (...args) => this.eventHandlers[event](this, ...args));
        }
        this.on('rateLimit', (e) => this.logger.warn(`Bot is being rate limitted: ${e}`))
    }

    /**
     * Logs the bot in, initially triggering the 'ready' event
     */
    login(token)
    {
        return super.login(token || this.config["token"]);
    }
}
