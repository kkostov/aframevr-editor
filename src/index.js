/* eslint import/no-extraneous-dependencies: ["off"] */
const electron = require('electron')
const path = require('path')
const url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }))

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

app.on('ready', createWindow)
app.on('window-all-closed', quit)
app.on('activate', activate)
