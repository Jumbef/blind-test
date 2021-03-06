const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require("path");
const http = require('http')
const fs = require('fs')

let winBack
let winfront
let buzz = false
const playlist = {}

app.whenReady().then(() => {
  winBack = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar: true,
    icon:'build/icon.png',
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "js/preload.js") // use a preload script
    }
  })
  winFront = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon:'build/icon.png',
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "js/preload.js") // use a preload script
    }
  })

  http.createServer(function (req, res) {
    res.writeHead(200,
      {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      })
    res.write('OK\n')

    if (!buzz) {
      let number = req.url.match(/\d*$/)
      if (number[0] > 0) {
        buzz = true
        winBack.webContents.send('fromMain', { type: 'command', name: 'buzz', params: {number:number[0]} })
        winFront.webContents.send('fromMain', { type: 'command', name: 'buzz', params: {numbef:number[0]} })
        console.log(number)
      }
    }

    return res.end()
  }).listen(8888)

  // Charger le fichier index.html de l'application.
  winBack.loadFile('html/winBack.html')
  winBack.addListener('close', (evt) => {
    evt.preventDefault()
    app.exit()
  })

  winFront.loadFile('html/winFront.html')
  winFront.addListener('close', (evt) => {
    evt.preventDefault()
  })
})


ipcMain.on('toMain', async (evt, data) => {
  console.log(data)
  switch (data.type) {
    case 'command':
      switch (data.name) {
        case 'exit':
          app.exit()
          break
        case 'load':
          winBack.webContents.send('fromMain', { type: 'command', name: 'stop' })
          winFront.webContents.send('fromMain', { type: 'command', name: 'stop' })
          winBack.webContents.send('fromMain', { type: 'command', name: 'load', params: playlist[data.params.fileid] })
          winFront.webContents.send('fromMain', { type: 'command', name: 'load', params: playlist[data.params.fileid] })
          break
        case 'play':
          winBack.webContents.send('fromMain', { type: 'command', name: 'play' })
          winFront.webContents.send('fromMain', { type: 'command', name: 'play' })
          break
        case 'stop':
          winBack.webContents.send('fromMain', { type: 'command', name: 'stop' })
          winFront.webContents.send('fromMain', { type: 'command', name: 'stop' })
          break
        case 'pause':
          winBack.webContents.send('fromMain', { type: 'command', name: 'pause' })
          winFront.webContents.send('fromMain', { type: 'command', name: 'pause' })
          break
        case 'progress':
          console.log(data)
          break
        case 'reset-buzz':
          buzz = false
          winBack.webContents.send('fromMain', { type: 'command', name: 'buzz' })
          winFront.webContents.send('fromMain', { type: 'command', name: 'buzz' })
          console.log("Buzzer reset")
          break
        case 'open-link':
          shell.openExternal(data.value)
          break

        case 'folder-select':
          const result = await dialog.showOpenDialog(winBack, {
            properties: ['openDirectory']
          }).catch()
          console.log('folder selected', result.filePaths)
          if (!result.canceled) {
            winBack.webContents.send('fromMain', { type: 'event', name: 'folder-selected', params: {folderpath:result.filePaths[0]} })
            fs.readdir(result.filePaths[0], (err, dir) => {
              let i = 1
              for (let filename of dir) {
                playlist[`tilte-${i}`] = {fileid:`tilte-${i}`, filepath:path.join(result.filePaths[0],filename), filename:filename}
                winBack.webContents.send('fromMain', { type: 'command', name: 'add-file', params: playlist[`tilte-${i}`] })
                console.log(playlist[`tilte-${i}`])
                i++
              }
            })
          }
          break

        default:
          break
      }
      break
    case 'event':
      switch (data.name) {
        case 'progress':
          console.log(data.params)
          break

        default:
          break
      }
      break
    default:
      break
  }
})

