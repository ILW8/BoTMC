module.exports = class MessageCollector {
    constructor(bot) {
        this.messageLogger = bot.logging.createLogger("messageLogger", {
            level: 'info',
            format: bot.logging.winston.format.combine(
                bot.logging.winston.format.timestamp(),
                bot.logging.winston.format.printf(
                    (info) => {
                        let logMsg = ""
                        logMsg += `${info.timestamp} `
                        logMsg += `[#${info.message.channel.name}] `
                        logMsg += `${info.message.author.username}#${info.message.author.discriminator} `
                        logMsg += `(${info.message.author.id}): `
                        logMsg += info.message.content !== "" ? `"${info.message.content}", ` : `<no text>, `
                        logMsg += `attachments: `
                        let attachments = []
                        info.message.attachments.forEach((value, key) => attachments.push(value.attachment))
                        logMsg += attachments.join(", ")
                        return logMsg
                    }
                )),
            transports: [
                // new bot.logging.winston.transports.Console()
                new bot.logging.winston.transports.File({filename: 'messages.log'}),
                // new bot.logging.winston.transports.Console()
            ]
        })
    }

    logMessage(message) {
        // console.log(message)
        this.messageLogger.info(message)
    }
}
