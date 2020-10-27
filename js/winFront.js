const { ipcRenderer } = require('electron')
ipcRenderer.on('log', (evt, arg) => {
    console.log(arg)
})

ipcRenderer.on('command', (evt, arg) => {
    switch (arg.name) {
        case 'load':
            console.log(arg)
            document.getElementById('audio').setAttribute('src', arg.params[0])
            break
        case 'play':
            document.getElementById('audio').play()
            break
        case 'pause':
            document.getElementById('audio').pause()
            break
        case 'stop':
            document.getElementById('audio').pause()
            //document.getElementById('audio').stop()
            break

        default:
            break;
    }

})
