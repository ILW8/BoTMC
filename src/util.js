const { Collection } = require(`discord.js`);
const { readdirSync } = require(`fs`);
module.exports =
{
    loaddir : (path, fileType) =>
    {
        let loaded = new Collection();
        for(let file of readdirSync(path))
        {
            if(file.endsWith(fileType))
            {
                let fullPath = `${path}/${file}`;
                loaded.set(file.slice(0, -fileType.length), require(fullPath));
            }
        }
        return loaded;
    }
}