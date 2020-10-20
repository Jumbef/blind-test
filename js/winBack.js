const { ipcRenderer } = require('electron')
let currentId = 'title-0'
ipcRenderer.on('log', (event, message) => {
    console.log(message)
})
ipcRenderer.on('load', (event, message) => {
    currentId = message
    document.getElementById(currentId).setAttribute('class', 'loaded')
})
ipcRenderer.on('play', (event, message) => {
    document.getElementById(currentId).setAttribute('class', 'playing')
})
ipcRenderer.on('stop', (event, message) => {
    document.getElementById(currentId).setAttribute('class', 'played')
})
ipcRenderer.on('folder-selected', (event, message) => {
    document.getElementById('folder-selected').innerText = message
})
ipcRenderer.on('add-file', (event, message) => {
    const li = document.createElement("li")
    li.setAttribute('id', message[0])
    li.setAttribute('data-filepath', message[1])
    li.setAttribute('data-filename', message[2])
    li.innerText = message[2]
    document.getElementById('playlist').appendChild(li)
})
