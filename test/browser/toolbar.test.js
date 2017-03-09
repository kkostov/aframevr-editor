jest.mock('electron-config')
const toolbar = require('../../src/app/views/toolbar')
const Config = require('electron-config')

describe('initToolbar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('reads user settings', () => {
    toolbar.initToolbar()
    expect(Config.prototype.get.mock.calls.length).toBe(1)
  })
})

describe('showFileBrowser', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('appends panel into .pane-group', () => {
    document.body.innerHTML = `
    <div class="pane-group"></div>
    `
    toolbar.showFileBrowser()
    expect(document.getElementById('fileBrowser')).toBeTruthy()
  })

  it('tollerates already shown', () => {
    document.body.innerHTML = `
    <div class="pane-group"><div id="fileBrowser"></div></div>
    `
    toolbar.showFileBrowser()
    expect(document.querySelectorAll('#fileBrowser').length).toBe(1)
  })

  it('updates user settings', () => {
    document.body.innerHTML = `
    <div class="pane-group"></div>
    `
    toolbar.showFileBrowser()
    expect(Config.prototype.set.mock.calls.length).toBe(1)
    expect(Config.prototype.set.mock.calls[0][0]).toBe('toolbar.fileBrowser.showFileBrowser')
    expect(Config.prototype.set.mock.calls[0][1]).toBe(true)
  })
})

describe('hideFileBrowser', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('removes panel from .pane-group', () => {
    document.body.innerHTML = `
    <div class="pane-group"><div id="fileBrowser"></div></div>
    `
    toolbar.hideFileBrowser()
    expect(document.getElementById('fileBrowser')).toBeNull()
  })

  it('tollerates already hidden', () => {
    document.body.innerHTML = `
    <div class="pane-group"></div>
    `
    toolbar.hideFileBrowser()
    expect(document.getElementById('fileBrowser')).toBeNull()
  })

  it('updates user settings', () => {
    document.body.innerHTML = `
    <div class="pane-group"><div id="fileBrowser"></div></div>
    `
    toolbar.hideFileBrowser()
    expect(Config.prototype.set.mock.calls.length).toBe(1)
    expect(Config.prototype.set.mock.calls[0][0]).toBe('toolbar.fileBrowser.showFileBrowser')
    expect(Config.prototype.set.mock.calls[0][1]).toBe(false)
  })
})
