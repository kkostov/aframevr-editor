const dialog = require('electron').dialog

const files = require('./files')

// loads a scene from a url
function loadUrl(focusedWindow, url) {
    // focusedWindow.webContents.once('did-finish-load', () => {
    //     const contents = focusedWindow.webContents
    //     contents.executeJavaScript('window.postMessage(\'INJECT_AFRAME_INSPECTOR\', \'*\');')
    // })
    focusedWindow.loadURL(url)
}

// activates the aframe-inspector in a scene
function injectInspector(focusedWindow) {
    const contents = focusedWindow.webContents
    contents.executeJavaScript('window.postMessage(\'INJECT_AFRAME_INSPECTOR\', \'*\');')
}

// creates a blank html file
function loadNewScene(focusedWindow) {
    // the blank file is essentially the starting url
    // this can be made with integration using the angle tool
    focusedWindow.loadURL(files.getViewUrl('inspector.html'))
}

function openScene(focusedWindow) {
    // open a scene from the file system
    const filePath = dialog.showOpenDialog({ properties: ['openFile'] })
    const fileUrl = `file://${filePath}`
    focusedWindow.loadURL(fileUrl)
}

module.exports = {
    loadUrl,
    injectInspector,
    loadNewScene,
    openScene,
}
