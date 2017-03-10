const Config = require('electron-config')


const config = new Config()

const editors = []

/** loads the source scene into a new webview as a child of the given targetElement */
const openNewEditor = (source, targetElement) => {
  const editor = {}
  editor.id = `editor${editors.length}`
  editor.src = source
  const editorHtml = `<webview id="${editor.id}" src="${editor.src}"  style="display:inline-flex; width:100%; height:100%"></webview>`
  targetElement.insertAdjacentHTML('beforeend', editorHtml)
  const editorElement = document.getElementById(editor.id)
  editorElement.addEventListener('did-finish-load', () => {
    editorElement.getWebContents().executeJavaScript('window.postMessage(\'INJECT_AFRAME_INSPECTOR\', \'*\');')
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
  const handleNewScene = () => {
    const targetElement = document.querySelector('.pane-group')
    openNewEditor('../templates/template1.html', targetElement)
  }
  if (newSceneButton) {
    newSceneButton.addEventListener('click', handleNewScene)
  }
  restoreSettings()
}

module.exports = {
  initToolbar,
  showFileBrowser,
  hideFileBrowser,
  openNewEditor,
}
