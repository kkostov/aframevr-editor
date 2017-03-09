const Config = require('electron-config')


const config = new Config()


const showFileBrowser = () => {
  const fileBrowserTemplate = `
      <div id="fileBrowser" class="pane pane-sm sidebar">
        <nav class="nav-group">
            <h5 class="nav-group-title">Favorites</h5>
            <span class="nav-group-item"><span class="icon icon-folder"></span> connors</span>
            <span class="nav-group-item active"><span class="icon icon-light-up"></span> Photon</span>
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
  restoreSettings()
}

module.exports = {
  initToolbar,
  showFileBrowser,
  hideFileBrowser,
}
