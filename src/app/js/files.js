const path = require('path')
const url = require('url')

const viewsFolder = '../views'

const getViewUrl = fileName => url.format({
    pathname: path.join(__dirname, viewsFolder, fileName),
    protocol: 'file:',
    slashes: true,
})

const filePathToUrl = filepath => url.format({
    pathname: filepath,
    protocol: 'file:',
    slashes: true,
})

module.exports = {
    getViewUrl,
    filePathToUrl,
}
