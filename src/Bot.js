const { Client } = require(`discord.js`);
const { loaddir } = require(`${__dirname}/util.js`);
module.exports = class Bot extends Client
{
    constructor(config)
    {
        super(config["clientOptions"]);
        this.config = config;
        this.eventHandlers = undefined;
        this.loadHandlers();
    }

    loadHandlers()
    {
        this.eventHandlers = loaddir(`${__dirname}/events`, `.js`);
        for(let [name, func] of this.eventHandlers)
        {
            this.on(name, (...args) => func(...args, this));
        }
    }

    login(token)
    {
        console.log(this.eventHandlers);
        if(token === undefined)
        {
            return super.login(token);
        }
        else
        {
            return super.login(this.config.token);
        }
    }
}
