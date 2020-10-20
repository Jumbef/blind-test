const { ipcRenderer } = require('electron')
ipcRenderer.on('log', (event, message) => {
    console.log(message)
})
ipcRenderer.on('load', (event, message) => {
    console.log(message)
    document.getElementById('audio').setAttribute('src', message)
})
ipcRenderer.on('play', (event, message) => {
    document.getElementById('audio').play()
})
ipcRenderer.on('pause', (event, message) => {
    document.getElementById('audio').pause()
})
ipcRenderer.on('stop', (event, message) => {
    document.getElementById('audio').pause()
    //document.getElementById('audio').stop()
})
