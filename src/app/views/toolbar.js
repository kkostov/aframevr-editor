const Config = require('electron-config')

const config = new Config()

const currentEditor = {}

/** prompts the user to select a working directory and creates a simple scene */
const newScene = () => {
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

  // todo: check if there is already an editor open and prompt to save changes
  currentEditor.id = 'editor'
  currentEditor.src = newFile
  currentEditor.workDir = workingDir[0]
  const editorHtml = `<webview id="${currentEditor.id}" src="${currentEditor.src}"  style="display:inline-flex; width:100%; height:100%"></webview>`
  targetElement.insertAdjacentHTML('beforeend', editorHtml)
  const editorElement = document.getElementById(currentEditor.id)
  editorElement.addEventListener('did-finish-load', () => {
    editorElement.getWebContents().executeJavaScript('window.postMessage(\'INJECT_AFRAME_INSPECTOR\', \'*\');')
  })

  return undefined
}

const saveScene = () => {
  const webView = document.getElementById(currentEditor.id)
  const exctractSourceFunc = `
  function extractScene() {
    const target = document.querySelector("a-scene")
    if(!target) {
      return undefined
    }
    const wrap = document.createElement("div")
    wrap.appendChild(target.cloneNode(true))
    const result = wrap.innerHTML
    wrap.remove()
    return result
  }
  extractScene()
  `
  webView.executeJavaScript(exctractSourceFunc, (result) => {
    if (!result) {
      throw new Error('There was problem saving changes. Failed to extract scene source.')
    }

    const app = require('electron').remote
    const fs = app.require('fs')

    fs.writeFile(currentEditor.src, result, (err) => {
      if (err) throw err
    })
  })
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
  if (newSceneButton) {
    newSceneButton.addEventListener('click', () => newScene())
  }

  // toolbar - save scene
  const saveSceneButton = document.getElementById('saveScene')
  if (saveSceneButton) {
    saveSceneButton.addEventListener('click', () => saveScene())
  }

  restoreSettings()
}

module.exports = {
  initToolbar,
  showFileBrowser,
  hideFileBrowser,
  newScene,
}
