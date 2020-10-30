window.api.receive("fromMain", (data) => {
    switch (data.type) {
        case 'log':
            console.log(data)
            break
        case 'command':
            switch (data.name) {
                case 'load':
                    console.log(data)
                    document.getElementById('audio').setAttribute('src', data.params[0])
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
                    break
            }
            break
        case 'event':
            break
        default:
            break
    }
})