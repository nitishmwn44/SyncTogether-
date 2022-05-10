
var URL = window.URL || window.webkitURL;

var syncVideo = (file)=>{
    var fileURL = URL.createObjectURL(file);
    var fileType = file.type;
    JsPlayer.src({type: fileType, src: fileURL});
    isSyncVideo = true;
    YtPlayer.loadVideoById({videoId: '',startSeconds: 0});
    localPlayer.src = '';
    currJsUrl = '';
    currYTUrl = '';
    JsDiv.style.display = 'block';
    YtDiv.style.display = 'none';
    localPlayer.style.display = 'none';
    if(!admin_token) return;
    if(admin_token) socket.emit('newVideo',{type: currVideoType,room_id: room_id});

    let data = {};
        data['type'] = currVideoType;
        data['url'] = currJsUrl;
        data['time'] = JsPlayer.currentTime();
        if(!JsPlayer.paused()) data['state'] = 'PLAYING';
        else data['state'] = 'PAUSED';
        data['room_id'] = room_id;
        data['admin_token'] = admin_token;
        socket.emit('videoStateChanged',data);
}