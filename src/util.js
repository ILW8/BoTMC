const { Collection } = require(`discord.js`);
const { readdirSync } = require(`fs`);

/**
 * require()s all files of a directory and links them with their filenames in a Collection
 * @param {string} path Path to the directory to load from
 * @param {string} fileType File type to accept
 */
module.exports.loaddir = (path, fileType) =>
{
    let loaded = new Collection();
    for(let file of readdirSync(path))
    {
        if(file.endsWith(fileType))
        {
            let fullPath = `${path}/${file}`;
            loaded.set(file.slice(0, -fileType.length), require(fullPath)); //only the file name, without extension
        }
    }
    return loaded;
}