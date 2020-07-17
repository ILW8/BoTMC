const { readdirSync, readFileSync, existsSync } = require(`fs`);

/**
 * require()s all files of a directory and links them with their filenames in a Collection
 * @param {string} path Path to the directory to load from
 * @param {string} fileType File type to accept
 */
module.exports.loaddir = (path, fileType) =>
{
    let loaded = {};
    for(let file of readdirSync(path))
    {
        if(file.endsWith(fileType))
        {
            let fullPath = `${path}/${file}`;
            loaded[file.slice(0, -fileType.length)] = require(fullPath); //only the file name, without extension
        }
    }
    return loaded;
}
/**
 * Loads a json file into an object and outputs it
 * @param {string} path
 */
module.exports.loadToObject = (path) =>
{
    if(!existsSync(path)) return console.log(`Invalid file: ${path}`);
    return JSON.parse(readFileSync(path, 'utf8'));
}
