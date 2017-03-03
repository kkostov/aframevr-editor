const path = require('path')
const url = require('url')

const publicFolder = './static'

/** Returns the formatted url of the given file */
const getStaticFileUrl = fileName => url.format({
    pathname: path.join(__dirname, publicFolder, fileName),
    protocol: 'file:',
    slashes: true,
})

module.exports = {
    getStaticFileUrl,
}
