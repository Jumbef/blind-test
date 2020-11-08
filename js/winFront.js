//TODO: Gèrer les jeux de couleurs pour loaded/selected/playing/played sous forme de classes css prioritaires les unes sur les autres.


window.onload = () => {
    document.getElementById('player').ontimeupdate = () => {
        window.api.send('toMain',{type:'event',name:'progress',params:{progress:document.getElementById('player').currentTime}})
    }
}
window.api.receive("fromMain", (data) => {
    switch (data.type) {
        case 'log':
            console.log(data)
            break
        case 'command':
            switch (data.name) {
                case 'load':
                    console.log(data)
                    document.getElementById('player').setAttribute('src', data.params.filepath)
                    break
                case 'play':
                    document.getElementById('player').play()
                    break
                case 'pause':
                    document.getElementById('player').pause()
                    break
                case 'stop':
                    document.getElementById('player').pause()
                    //document.getElementById('player').stop()
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