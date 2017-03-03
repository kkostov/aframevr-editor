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

// creates an blank html file
function loadNewScene(focusedWindow) {
  // the blank file is essentially the starting url
    focusedWindow.loadURL(files.getStaticFileUrl('inspector.html'))
}

module.exports = {
    loadUrl,
    injectInspector,
    loadNewScene,
}
