const electron = require('electron')
const loader = require('./vrloader')
const examples = require('./vrexamples')

const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app

const template = [{
    label: 'Examples',
    submenu: examples.map(example => ({
        label: example.label,
        click(item, focusedWindow) {
            if (focusedWindow) {
                loader.loadUrl(focusedWindow, example.url)
            }
        },
    })),
}, {
    label: 'View',
    submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
            if (focusedWindow) {
                    // on reload, start fresh and close any old
                    // open secondary windows
                if (focusedWindow.id === 1) {
                    BrowserWindow.getAllWindows().forEach((win) => {
                        if (win.id > 1) {
                            win.close()
                        }
                    })
                }
                focusedWindow.reload()
            }
        },
    }, {
        label: 'Toggle Full Screen',
        accelerator: (function () {
            if (process.platform === 'darwin') {
                return 'Ctrl+Command+F'
            }
            return 'F11'
        }()),
        click(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
        },
    }, {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
            if (process.platform === 'darwin') {
                return 'Alt+Command+I'
            }
            return 'Ctrl+Shift+I'
        }()),
        click(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        },
    }, {
        label: 'Toggle Aframe Inspector',
        click(item, focusedWindow) {
            if (focusedWindow) {
                loader.injectInspector(focusedWindow)
            }
        },
    }, {
        type: 'separator',
    }],
}, {
    label: 'Window',
    role: 'window',
    submenu: [{
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
    }, {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
    }, {
        type: 'separator',
    }, {
        label: 'Reopen Window',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click() {
            app.emit('activate')
        },
    }],
}, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'Learn More',
        click() {
            electron.shell.openExternal('http://electron.atom.io')
        },
    }],
},
]

function addUpdateMenuItems(items, position) {
    if (process.mas) return

    const version = electron.app.getVersion()
    const updateItems = [{
        label: `Version ${version}`,
        enabled: false,
    }, {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate',
    }, {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click() {
            require('electron').autoUpdater.checkForUpdates()
        },
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click() {
            require('electron').autoUpdater.quitAndInstall()
        },
    }]

    items.splice(...[position, 0].concat(updateItems))
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu()
    if (!menu) return undefined

    let reopenMenuItem
    menu.items.forEach((item) => {
        if (item.submenu) {
            item.submenu.items.forEach((submenu) => {
                if (submenu.key === 'reopenMenuItem') {
                    reopenMenuItem = submenu
                }
            })
        }
    })
    return reopenMenuItem
}

if (process.platform === 'darwin') {
    const name = electron.app.getName()
    template.unshift({
        label: name,
        submenu: [{
            label: `About ${name}`,
            role: 'about',
        }, {
            type: 'separator',
        }, {
            label: 'Services',
            role: 'services',
            submenu: [],
        }, {
            type: 'separator',
        }, {
            label: `Hide ${name}`,
            accelerator: 'Command+H',
            role: 'hide',
        }, {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers',
        }, {
            label: 'Show All',
            role: 'unhide',
        }, {
            type: 'separator',
        }, {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() {
                app.quit()
            },
        }],
    })

    // Window menu.
    template[3].submenu.push({
        type: 'separator',
    }, {
        label: 'Bring All to Front',
        role: 'front',
    })

    addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
    addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', () => {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})

app.on('browser-window-created', () => {
    const reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', () => {
    const reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
})
