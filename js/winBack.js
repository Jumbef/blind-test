const { ipcRenderer } = require('electron')
let currentId = 'title-0'

document.onload = () => {
    document.getElementById('LoadButton').onclick = () => {
        ipcRenderer.send('command', { name: 'load' })
    }
    document.getElementById('PlayButton').onclick = () => {
        ipcRenderer.send('command', { name: 'play' })
    }
    document.getElementById('PauseButton').onclick = () => {
        ipcRenderer.send('command', { name: 'pause' })
    }
    document.getElementById('StopButton').onclick = () => {
        ipcRenderer.send('command', { name: 'stop' })
    }
    document.getElementById('ResetBuzzButton').onclick = () => {
        ipcRenderer.send('command', { name: 'resetbuzz' })
    }
    document.getElementById('SelectFolderButton').onclick = () => {
        ipcRenderer.send('command', { name: 'folder-select' })
    }
}
ipcRenderer.on('log', (evt, arg) => {
    console.log(arg)
})
ipcRenderer.on('event', (evt, arg) => {
    switch (arg.name) {
        case 'folder-selected':
            document.getElementById('folder-selected').innerText = arg.params[0]
            break
    }
})

ipcRenderer.on('command', (evt, arg) => {
    switch (arg.name) {
        case 'load':
            currentId = arg.params[0]
            document.getElementById(currentId).setAttribute('class', 'loaded')
            break
        case 'play':
            document.getElementById(currentId).setAttribute('class', 'playing')
            break
        case 'stop':
            document.getElementById(currentId).setAttribute('class', 'played')
            break
        case 'add-file':
            const li = document.createElement("li")
            li.setAttribute('id', arg.params[0])
            li.setAttribute('data-filepath', arg.params[1])
            li.setAttribute('data-filename', arg.params[2])
            li.innerText = arg.params[2]
            document.getElementById('playlist').appendChild(li)
            break

        default:
            break;
    }
})

