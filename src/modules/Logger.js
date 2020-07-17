//placeholder for actual logger module here
const winston = require('winston');

module.exports = class Logger {
    constructor() {
        this.instances = {}
        this.instances["default"] = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: {service: 'user-service'},
            transports: [
                //
                // - Write all logs with level `error` and below to `error.log`
                // - Write all logs with level `info` and below to `combined.log`
                //
                new winston.transports.File({filename: 'error.log', level: 'error'}),
                new winston.transports.File({filename: 'combined.log'}),
            ],
        });

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
        if (process.env.NODE_ENV !== 'production') {
            this.instances["default"].add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.align(),
                    winston.format.printf((info) => {
                        return ("moduleLabel" in info) ?
                            `${info.timestamp} [${info.moduleLabel}] ${info.level}: ${info.message}` :
                            `${info.timestamp} ${info.level}: ${info.message}`
                    })
                )
            }));
        }
    }

    createLogger(loggerName, loggerOptions)
    {
        this.instances[loggerName] = winston.createLogger(loggerOptions)
    }

    getLoggers() {
        return this.instances
    }

    getLogger(loggerName){
        return this.instances[loggerName]
    }

    getDefaultLogger(){
        return this.getLogger("default")
    }
}



