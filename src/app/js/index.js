const electron = require('electron')
const files = require('./files')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
    // screen information is only available after the app ready event
    const screenInfo = require('./screen')
    mainWindow = new BrowserWindow({
        width: screenInfo.size.width,
        height: screenInfo.size.height,
    })

    mainWindow.loadURL(files.getViewUrl('index.html'))

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function quit() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}

function activate() {
    if (mainWindow === null) {
        createWindow()
    }
}

// setup menu items
require('./menus')

app.on('ready', createWindow)
app.on('window-all-closed', quit)
app.on('activate', activate)
