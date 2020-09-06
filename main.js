const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

function createWindowBack () {
  const winBack = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // et charger le fichier index.html de l'application.
  winBack.loadFile('html/winBack.html')
}
function createWindowFront () {
  // Cree la fenetre du navigateur.
  const winFront = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // et charger le fichier index.html de l'application.
  winFront.loadFile('html/winFront.html')
}
function createWindows () {
  createWindowBack()
  createWindowFront()
}

app.whenReady().then(createWindows)

ipcMain.on('close-app', (evt, arg) => {
  app.quit()
})
ipcMain.on('open-front', (evt, arg) => {
  createWindowFront()
  for (window of BrowserWindow.getAllWindows()) {
    window.webContents.send('log','New Front window')
  }
})
