const Config = require('electron-config')

const config = new Config()


const saveEditor = (editorId) => {
  const webView = document.getElementById(editorId)
  console.log({ contents: webView.getWebContents() })
}

/** prompts the user to select a working directory and creates a simple scene */
const openNewEditor = () => {
  const app = require('electron').remote
  const fs = app.require('fs')
  const path = app.require('path')

  // get the new working directory
  const dialog = app.dialog
  const workingDir = dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })

  if (!workingDir || workingDir.length === 0) {
    // user canceled
    return undefined
  }

  // copy the template to the new working folder
  const newFile = path.join(workingDir[0], 'index.html')
  fs.createReadStream(path.join(__dirname, 'template1.html')).pipe(fs.createWriteStream(newFile))

  // load the new file as a scene
  const targetElement = document.querySelector('.pane-group')
  const editor = {
    id: 'editor',
    src: newFile,
    workDir: workingDir[0],
  }
  const editorHtml = `<webview id="${editor.id}" src="${editor.src}"  style="display:inline-flex; width:100%; height:100%"></webview>`
  targetElement.insertAdjacentHTML('beforeend', editorHtml)
  const editorElement = document.getElementById(editor.id)
  editorElement.addEventListener('did-finish-load', () => {
    editorElement.getWebContents().executeJavaScript('window.postMessage(\'INJECT_AFRAME_INSPECTOR\', \'*\');')
  })

  return undefined
}

const showFileBrowser = () => {
  const fileBrowserTemplate = `
      <div id="fileBrowser" class="pane pane-sm sidebar">
        <nav class="nav-group">
            <span class="nav-group-item"><span class="icon icon-down-open"></span> src</span>
            <span class="nav-group-item"><span class="icon icon-file"></span> main.js</span>
        </nav>
      </div>
      `
  const el = document.getElementById('fileBrowser')
  if (!el) { // in case already shown
    const elParent = document.querySelector('.pane-group')
    elParent.insertAdjacentHTML('afterbegin', fileBrowserTemplate)
  }
  config.set('toolbar.fileBrowser.showFileBrowser', true)
}

const hideFileBrowser = () => {
  const el = document.getElementById('fileBrowser')
  if (el) { // in case already hidden
    el.remove()
  }
  config.set('toolbar.fileBrowser.showFileBrowser', false)
}

const restoreSettings = () => {
  const fileBrowserConfig = config.get('toolbar.fileBrowser')
  if (fileBrowserConfig) {
    // restore showFileBrowser settings
    if (fileBrowserConfig.showFileBrowser === true) {
      showFileBrowser()
    } else {
      hideFileBrowser()
    }
  }
}

/** Attaches toolbar actions to their corresponding buttons */
const initToolbar = () => {
  // toolbar - toggleFileBrowser
  const toggleFileBrowserButton = document.getElementById('toggleFileBrowser')
  const handleToggleFilesPane = () => {
    // check if the filebrowser is already added
    const el = document.getElementById('fileBrowser')
    if (el) {
      hideFileBrowser()
    } else {
      showFileBrowser()
    }
  }
  if (toggleFileBrowserButton) {
    toggleFileBrowserButton.addEventListener('click', handleToggleFilesPane)
  }

  // toolbar - new scene
  const newSceneButton = document.getElementById('newScene')
  const handleNewScene = () => {
    const targetElement = document.querySelector('.pane-group')
    openNewEditor('../templates/template1.html', targetElement)
  }
  if (newSceneButton) {
    newSceneButton.addEventListener('click', handleNewScene)
  }

  // toolbar - save scene
  const saveSceneButton = document.getElementById('saveScene')
  const handleSaveScene = () => {
    saveEditor('editor')
  }
  if (saveSceneButton) {
    saveSceneButton.addEventListener('click', handleSaveScene)
  }

  restoreSettings()
}

module.exports = {
  initToolbar,
  showFileBrowser,
  hideFileBrowser,
  openNewEditor,
}
