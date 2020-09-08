const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

let winBack
let winfront

app.whenReady().then( () => {
  winBack = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  winFront = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Charger le fichier index.html de l'application.
  winBack.loadFile('html/winBack.html')
  winFront.loadFile('html/winFront.html')

  winBack.addListener('close',(evt) =>{
    evt.preventDefault()
    app.exit()
  })
  winFront.addListener('close',(evt) =>{
    evt.preventDefault()
  })
})


ipcMain.on('exit', (evt, arg) => {
  app.exit()
})
ipcMain.on('load', (evt, arg) => {
  winFront.webContents.send('load',arg)
})
ipcMain.on('play', (evt, arg) => {
  winFront.webContents.send('play')
})
ipcMain.on('pause', (evt, arg) => {
  winFront.webContents.send('pause')
})
ipcMain.on('progress', (evt, arg) => {
  console.log(arg)
})

