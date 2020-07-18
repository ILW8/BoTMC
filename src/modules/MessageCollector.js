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
                        let chnPadLength = `[#${info.message.channel.name}] `.length > 16 ? 36 : 20
                        let namePadLength = `${info.message.author.username}#${info.message.author.discriminator}`.length > 16 ? 32 : 16

                        logMsg += `[#${info.message.channel.name}] `.padStart(chnPadLength)
                        logMsg += `${info.message.author.username}#${info.message.author.discriminator} `.padStart(namePadLength)
                        logMsg += `(${info.message.author.id}): `
                        logMsg += info.message.content !== "" ? `"${info.message.content}"` : `<no text>`
                        if (info.message.attachments.size > 0)
                        {
                            logMsg += `, attachments: `
                            let attachments = []
                            info.message.attachments.forEach((value, key) => attachments.push(value.attachment))
                            logMsg += attachments.join(", ")
                        }
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
