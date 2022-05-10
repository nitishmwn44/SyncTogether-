
var videoSearchForm = document.getElementById('video-search-form');
const selectType = document.querySelector('.form-select');
const videoInput = document.querySelector('.video-input');
const syncInput = document.querySelector('.sync-input');
const searchContainer = document.querySelector('.search-container');
var currYTUrl=null;
var currJsUrl=null;
var currVideoType = 0;
var isSyncVideo = false;
videoSearchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formData = new FormData(videoSearchForm);
    const jsonData = {};
    formData.forEach((value,key)=>{
        jsonData[key]=value;
    });
    let url = jsonData['search'];
    if(!url)return;
    YtDiv = document.querySelector('#yt-player');
    

    
    if(selectType.value == 0){
        if(currYTUrl == url) return;
        if(isLocalStream){
            isLocalStream = false;
            removeBroadcast();
        }
        YtDiv.style.display = 'block';
        JsDiv.style.display = 'none';
        url = getYtId(url);
        currVideoType = 0;
        YtPlayer.loadVideoById({videoId: url,startSeconds: 0});
        JsPlayer.src('a.mp4');
        if(isSyncVideo) isSyncVideo = false;
        currYTUrl = url;
        currJsUrl = '';
        socket.emit('newVideo',{type:selectType.value,room_id: room_id});
    }
    else if(selectType.value == 1 ||selectType.value == 2){
        if(isLocalStream){
            isLocalStream = false;
            removeBroadcast();
        }
        if(currJsUrl == url) return;
        YtDiv.style.display = 'none';
        JsDiv.style.display = 'block';
        currVideoType = selectType.value;
        JsPlayer.src(url);
        if(isSyncVideo) isSyncVideo = false;
        YtPlayer.loadVideoById({videoId: '',startSeconds: 0});
        currYTUrl = '';
        currJsUrl = url;
        socket.emit('newVideo',{type:selectType.value,room_id: room_id});
    }

});

selectType.addEventListener('change',()=>{
    if(selectType.value == 3){
        if(admin_token) videoInput.style.display = 'inline-block';
        searchContainer.style.display = 'none';
        syncInput.style.display = 'none';
    }
    else if(selectType.value == 4){
        syncInput.style.display = 'inline-block';
        videoInput.style.display = 'none';
        searchContainer.style.display = 'none';
        
    }
    else{
        videoInput.style.display = 'none';
        syncInput.style.display = 'none';
        searchContainer.style.display = 'inline-block';
    }
});

videoInput.addEventListener('change',(event)=>{
    if(isLocalStream){
        isLocalStream = false;
        removeBroadcast();
    }
    currVideoType = 3;
    let file = videoInput.files[0];
    broadcastVideo(file);
});

syncInput.addEventListener('change',(event)=>{
    if(isLocalStream){
        isLocalStream = false;
        removeBroadcast();
    }
    currVideoType = 4;
    let file = syncInput.files[0];
    syncVideo(file);
    if(!admin_token)socket.emit('getState',{room_id: room_id});
    
});





function getYtId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}



