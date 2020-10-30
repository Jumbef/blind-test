let currentId = 'title-0'

window.onload = () => {
    document.getElementById('LoadButton').onclick = () => {
        window.api.send('toMain', { type: 'command', name: 'load' })
    }
    document.getElementById('PlayButton').onclick = () => {
        window.api.send('toMain', { type: 'command', name: 'play' })
    }
    document.getElementById('PauseButton').onclick = () => {
        window.api.send('toMain', { type: 'command', name: 'pause' })
    }
    document.getElementById('StopButton').onclick = () => {
        window.api.send('toMain', { type: 'command', name: 'stop' })
    }
    document.getElementById('ResetBuzzButton').onclick = () => {
        window.api.send('toMain', { type: 'command', name: 'reset-buzz' })
    }
    document.getElementById('SelectFolderButton').onclick = () => {
        window.api.send('toMain', { type: 'command', name: 'folder-select' })
    }
}


window.api.receive("fromMain", (data) => {
    switch (data.type) {
        case 'log':
            console.log(data)
            break
        case 'event':
            switch (data.name) {
                case 'folder-selected':
                    document.getElementById('folder-selected').innerText = data.params[0]
                    break
            }
            break
        case 'command':
            switch (data.name) {
                case 'load':
                    currentId = data.params[0]
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
                    li.setAttribute('id', data.params[0])
                    li.setAttribute('data-filepath', data.params[1])
                    li.setAttribute('data-filename', data.params[2])
                    li.innerText = data.params[2]
                    document.getElementById('playlist').appendChild(li)
                    break

                default:
                    break
            }

            break
        default:
            break
    }
})
