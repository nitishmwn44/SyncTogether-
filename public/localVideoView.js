console.log('viewer is here');

var client = new WebTorrent();

var JsVideoPlayer = document.querySelector('video');

var fun = ()=>{
    JsDiv.style.display = 'block';
    
client.add('magnet:?xt=urn:btih:2933ec8dbcc47874c7d67a7ddc82d61967fae9f5&dn=Sample+MP4+Video+File+for+Testing.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com', (torrent)=>{
    localPlayer.style.display = 'block';
    JsDiv.style.display = 'block';
    YtDiv.style.display = 'block';
    
    torrent.files.forEach(function (file) {
        // var file = torrent.files[0];
        
         file.renderTo('#local-player',{controls: true,autoplay: true, muted:true},(err,elm)=>{
             console.log(err);
             console.log(elm);
         });
      });    
    
        
    });
}

var viewVideo = (magnetURI)=>{
    client.add(magnetURI,(torrent)=>{
        var file = torrent.files[0];
        isLocalStream = true;
        if(isSyncVideo) isSyncVideo = false;
        file.renderTo('#local-player',{controls: true,autoplay: false, muted:true},(err,elm)=>{
            localPlayer.currentTime = time;
            if(state == 'PLAYING'){
                localPlayer.play();
            }
            else if(state == 'PAUSED'){
                localPlayer.pause();
            }
        });
    });
}

var removeView = ()=>{
    localPlayer.src = '';
    client.remove(currJsUrl,(err)=>{
        if(err)console.log(err);
    });
    isLocalStream = false;
    
}