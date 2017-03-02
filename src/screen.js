const electronScreen = require('electron').screen

const size = electronScreen.getPrimaryDisplay().workAreaSize

module.exports = {
  // size of the primary display work area
    size,
}
