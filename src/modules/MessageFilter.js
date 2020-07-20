const getUrls = require('get-urls');
const {loadToObject} = require(`${__dirname}/../util.js`);
const {readdirSync} = require(`fs`);

module.exports = class MessageFilter {


    constructor(contentFiltersPath, logger) {
        this.embedTypes = ["rich", "image", "video", "gifv", "article", "link"]
        this.logger = logger.child({moduleLabel: "ReactionCollector"});  // https://github.com/winstonjs/winston/pull/1598
        this.logger.defaultMeta["moduleLabel"] = "MessageFilter"

        this.filters = {}
        for (let file of readdirSync(contentFiltersPath)) {
            if (file.endsWith(".json")) {
                let fullPath = `${contentFiltersPath}/${file}`;
                this.filters[file.slice(0, -(".json".length))] = loadToObject(fullPath); //only the file name, without extension
            }
        }

    }


    filterMessage(message) {
        let waitForEmbedTimeout = 4000

        // if `guild` property is not defined, then it was a DM to the bot.
        if (message.guild === null) {
            return;
        }

        for (let [channelName, filterOptions] of Object.entries(this.filters)) {
            let channelIDTrace = `${message.guild.id}:${message.channel.id}`
            if (filterOptions.channels.includes(channelIDTrace)) {

                //If a message contains only text and no attachments, but the message contains a link, wait for discord
                //to fetch the contents from the link and generate the embed; this lets discord figure out if the link
                //is media or other. However, embeds take a few seconds to appear, therefore we wait until a specified
                //timeout is passed before deleting the message
                if (!filterOptions["allowedContent"]["textOnly"] && message.attachments.size + message.embeds.length === 0) {
                    if (getUrls(message.content).size === 0) {
                        this.logger.info(`Removing text-only message in [#${channelName} (${channelIDTrace})]: "${message.content}"`)
                        message.delete();
                        return;
                    }
                } else {
                    waitForEmbedTimeout = 0
                }

                setTimeout(() => {
                    if (message.attachments.size > 0)  // has attachment
                    {
                        //TODO: move these into functions and return a tuple for checking filter acceptance
                        for (let [, attachment] of message.attachments) {
                            let attachments = []
                            if (attachment.height == null) { // if attachment is not video or image or gif
                                if (!filterOptions["allowedContent"].attachments.files) {

                                    message.attachments.forEach((value, key) => attachments.push(value.attachment))
                                    let attachmentsList = attachments.join(", ")
                                    this.logger.info(`Removing non-media attachment in [#${channelName} (${channelIDTrace})]: [${attachmentsList}]`)

                                    message.delete()
                                    return
                                }
                            } else {
                                if (!filterOptions["allowedContent"].attachments.media) {

                                    message.attachments.forEach((value, key) => attachments.push(value.attachment))
                                    let attachmentsList = attachments.join(", ")
                                    this.logger.info(`Removing media attachment in [#${channelName} (${channelIDTrace})]: [${attachmentsList}]`)

                                    message.delete()
                                    return
                                }
                            }
                        }
                    }


                    if (message.embeds.length > 0)  // has embed
                    {
                        for (let embed of message.embeds) {
                            //TODO: when refactoring and moving this to a separate function, separate video and image
                            //TODO: please fix this soon, this is ugly af

                            for (let embedType of this.embedTypes) {
                                if (embed.type === embedType) {
                                    if (!(embedType in filterOptions["allowedContent"]["embeds"]) || !filterOptions["allowedContent"].embeds[embedType]) {

                                        this.logger.info(`Removing disallowed embed type (${embedType}) in [#${channelName} (${channelIDTrace})]: "${message.content}"`)

                                        message.delete();
                                        return;
                                    }
                                }
                            }

                        }
                    }
                }, waitForEmbedTimeout + 50)
            }
        }


    }
}
