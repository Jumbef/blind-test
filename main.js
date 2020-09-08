const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const { dialog } = require('electron')
const fs = require('fs');

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
ipcMain.on('folder-select', async (event, arg) => {
  const result = await dialog.showOpenDialog(winBack, {
    properties: ['openDirectory']
  })
  console.log('folder selected', result.filePaths)
  if (!result.canceled){
    winBack.webContents.send('folder-selected',result.filePaths[0])
    fs.readdir(result.filePaths[0], (err, dir) => {
      for(let filePath of dir){
        console.log(filePath)
      }
    });   
  }
})
