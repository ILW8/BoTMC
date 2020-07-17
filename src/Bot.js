const { Client } = require(`discord.js`);
const { loaddir, loadToObject } = require(`${__dirname}/util.js`);
const { Logger, ReactionCollector } = loaddir(`${__dirname}/modules`, `.js`);

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
        this.loadHandlers();
        this.reactionCollector = new ReactionCollector(loadToObject(`${__dirname}/../config/reactionCollectorConfig.json`));
    }

    /**
     * Loads event handler functions from the ~/src/events folder into their respective event listeners
     */
    loadHandlers()
    {
        this.eventHandlers = loaddir(`${__dirname}/events`, `.js`);
        for(let event in this.eventHandlers)
        {
            this.on(event, (...args) => this.eventHandlers[event](...args, this));
        }
    }

    /**
     * Logs the bot in, initially triggering the 'ready' event
     */
    login(token)
    {
        return super.login(token || this.config["token"]);
    }
}
