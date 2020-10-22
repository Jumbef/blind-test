const { Console } = require('console');
const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const { dialog } = require('electron')
const fs = require('fs');
const http = require('http')
const { shell } = require('electron')

let winBack
let winfront
let buzz = false
let playlist = []
let playlistIndex = 0

app.whenReady().then(() => {
  winBack = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  winFront = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  http.createServer(function (req, res) {
    res.writeHead(200,
      {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      });
    res.write('OK\n')

    if (!buzz) {
      let number = req.url.match(/\d*$/)
      if (number[0] > 0) {
        buzz = true
        winBack.webContents.send('buzz', number[0])
        winFront.webContents.send('buzz', number[0])
        console.log(number)
      }
    }

    return res.end()
  }).listen(8888)

  // Charger le fichier index.html de l'application.
  winBack.loadFile('html/winBack.html')
  winFront.loadFile('html/winFront.html')

  winBack.addListener('close', (evt) => {
    evt.preventDefault()
    app.exit()
  })
  winFront.addListener('close', (evt) => {
    evt.preventDefault()
  })
})


ipcMain.on('exit', (evt, arg) => {
  app.exit()
})
ipcMain.on('load', (evt, arg) => {
  winBack.webContents.send('stop')
  winFront.webContents.send('stop')
  winBack.webContents.send('load', playlist[playlistIndex][0])
  winFront.webContents.send('load', playlist[playlistIndex][1])
  playlistIndex++
  if (playlistIndex >= playlist.length) { playlistIndex = 0 }
})
ipcMain.on('play', (evt, arg) => {
  winBack.webContents.send('play')
  winFront.webContents.send('play')
})
ipcMain.on('stop', (evt, arg) => {
  winBack.webContents.send('stop')
  winFront.webContents.send('stop')
})
ipcMain.on('pause', (evt, arg) => {
  winBack.webContents.send('pause')
  winFront.webContents.send('pause')
})
ipcMain.on('progress', (evt, arg) => {
  console.log(arg)
})
ipcMain.on('resetbuzz', (evt, arg) => {
  buzz = false
  winBack.webContents.send('buzz', null)
  winFront.webContents.send('buzz', null)
  console.log("Buzzer reset")
})

ipcMain.on('open-link', (evt, arg) => {
  shell.openExternal(arg)
})


ipcMain.on('folder-select', async (event, arg) => {
  const result = await dialog.showOpenDialog(winBack, {
    properties: ['openDirectory']
  })
  console.log('folder selected', result.filePaths)
  if (!result.canceled) {
    winBack.webContents.send('folder-selected', result.filePaths[0])
    fs.readdir(result.filePaths[0], (err, dir) => {
      let i = 0
      for (let filePath of dir) {
        winBack.webContents.send('add-file', [`tilte-${i}`, `${result.filePaths[0]}/${filePath}`, filePath])
        playlist[i] = [`tilte-${i}`, `${result.filePaths[0]}/${filePath}`, filePath]
        console.log(filePath)
        i++
      }
    });
  }
})
