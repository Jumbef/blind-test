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
                    document.getElementById('folder-selected').innerText = data.params.fileid
                    break
            }
            break
        case 'command':
            switch (data.name) {
                case 'load':
                    currentId = data.params.fileid
                    document.getElementById(currentId).setAttribute('class', 'loaded')
                    break
                case 'play':
                    document.getElementById(currentId).setAttribute('class', 'playing')
                    break
                case 'stop':
                    document.getElementById(currentId).setAttribute('class', 'played')
                    break
                case 'add-file':
                    const li = document.createElement('li')
                    li.setAttribute('id', data.params.fileid)
                    li.setAttribute('data-filepath', data.params.filepath)
                    li.setAttribute('data-filename', data.params.filename)

                    const input = document.createElement('input')
                    input.setAttribute('id','radio-'+data.params.fileid)
                    input.setAttribute('type','radio')
                    input.setAttribute('name','playlist')
                    input.setAttribute('value',data.params.filepath)
                    input.onclick = () => {
                        window.api.send('toMain', { type: 'command', name: 'load', params: {fileid: data.params.fileid} })
                    }
                    
                    const label = document.createElement('label')
                    label.setAttribute('for','radio-'+data.params.fileid)
                    label.innerText = data.params.filename

                    li.appendChild(input)
                    li.appendChild(label)
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
