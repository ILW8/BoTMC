const getUrls = require('get-urls');
const { loadToObject } = require(`${__dirname}/../util.js`);
const { readdirSync } = require(`fs`);

module.exports = class MessageFilter {
    constructor(bot, contentFiltersPath) {
        this.filters = {}
        for(let file of readdirSync(contentFiltersPath))
        {
            if(file.endsWith(".json"))
            {
                let fullPath = `${contentFiltersPath}/${file}`;
                this.filters[file.slice(0, -(".json".length))] = loadToObject(fullPath); //only the file name, without extension
            }
        }

    }


    waitForEmbedFromURL(message) {
        return getUrls(message.content).size > 0;
    }

    filterMessage(message) {
        let waitForEmbedTimeout = 4000
        for (let [, filterOptions] of Object.entries(this.filters))
        {
            if (filterOptions.channels.includes(`${message.guild.id}:${message.channel.id}`)) {
                if (!filterOptions["allowedContent"]["textOnly"] && message.attachments.size + message.embeds.length === 0) {
                    if (!this.waitForEmbedFromURL(message)) {
                        message.delete();
                        return;
                    }
                }

                setTimeout(() => {
                    if (message.attachments.size > 0)  // has attachment
                    {
                        //TODO: move these into functions and return a tuple for checking filter acceptance
                        for (let [, attachment] of message.attachments) {
                            if (attachment.height == null) { // if attachment is not video or image or gif
                                // this.messageContents["hasMedia"] = this.messageContents["hasMedia"] || false
                                if (!filterOptions["allowedContent"].attachments.files) {
                                    message.delete()
                                    return
                                }
                            } else {
                                if (!filterOptions["allowedContent"].attachments.media) {
                                    message.delete()
                                    return
                                }
                            }
                        }
                    }
                    // console.log(message.embeds)
                    if (message.embeds.length > 0)  // has embed
                    {
                        for (let embed of message.embeds) {
                            //TODO: when refactoring and moving this to a separate function, separate video and image
                            if (embed.type !== "image" && embed.type !== "video") {
                                // this.messageContents["hasMedia"] = this.messageContents["hasMedia"] || false
                                console.log(embed.type)
                            } else {
                                if (!filterOptions["allowedContent"].embeds.image || !filterOptions["allowedContent"].embeds.video) {
                                    message.delete();
                                    return;
                                }
                            }
                        }
                    }
                }, waitForEmbedTimeout + 50)
            }
        }


    }
}
