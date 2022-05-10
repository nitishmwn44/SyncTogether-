console.log('broadcaster is here');

var client = new WebTorrent();
var URL = window.URL || window.webkitURL;
// var JsVideoPlayer = document.querySelector('video');

var broadcastVideo = (file)=>{
    JsLock = true;
    var fileURL = URL.createObjectURL(file);
    var fileType = file.type;
    // JsVideoPlayer.src = fileURL;
    JsPlayer.src({type: fileType, src: fileURL});
    YtPlayer.loadVideoById({videoId: '',startSeconds: 0});
    currJsUrl = '';
    currYTUrl = '';
    JsDiv.style.display = 'block';
    YtDiv.style.display = 'none';

    client.seed(file,(torrent)=>{
        currJsUrl = torrent.magnetURI;
        console.log(currJsUrl);
        isLocalStream = true;
        JsLock = false;
        if(isSyncVideo) isSyncVideo = false;
        socket.emit('newVideo',{type: currVideoType,room_id: room_id});
        broadFun();
    });

}

var broadFun = ()=>{
    let data = {};
        data['type'] = currVideoType;
        if(JsLock)return;
        if(!currJsUrl)return;
        data['url'] = currJsUrl;
        data['time'] = JsPlayer.currentTime();
        if(!JsPlayer.paused()) data['state'] = 'PLAYING';
        else data['state'] = 'PAUSED';
        data['room_id'] = room_id;
        data['admin_token'] = admin_token;
        socket.emit('videoStateChanged',data);
}

var removeBroadcast = ()=>{
    client.remove(currJsUrl,(err)=>{
        if(err)console.log(err);
    });
}
