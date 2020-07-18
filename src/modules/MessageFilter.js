module.exports = class MessageFilter {
    constructor(bot) {

    }

    filterMessage(message)
    {
        setTimeout(() => {
            // console.log(message)
            console.log(message.content)
            console.log(message.attachments)
            console.log(message.embeds)
        }, 500)
        if(message.attachments.size > 0)
        {
            console.log("OKAY")
        }
    }
}
