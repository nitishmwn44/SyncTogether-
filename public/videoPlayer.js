
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var YtPlayer;
var JsPlayer;
var YtDiv;
var JsDiv;
var localPlayer = document.getElementById('local-player');
var JsLock = false;
var isLocalStream = false;

function onYouTubeIframeAPIReady() {
  temp++;
  if(temp==2){
    YtFun();

  }
}
var YtFun = ()=>{
  YtPlayer = new YT.Player('yt-player', {
    height: '390',
    width: '640',
    videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  YtDiv = document.querySelector('#yt-player');
  if(!admin_token) socket.emit('getState',{room_id : room_id});
  
}

function onPlayerStateChange(event) {
  if(!admin_token) return;
  if(event.data == YT.PlayerState.PLAYING){
    socket.emit('videoStateChanged',{type: currVideoType,time: YtPlayer.getCurrentTime(),url: currYTUrl, state: 'PLAYING',room_id:room_id ,admin_token: admin_token});
      
  }
  else if(event.data == YT.PlayerState.PAUSED){
    socket.emit('videoStateChanged',{type: currVideoType,time: YtPlayer.getCurrentTime(),url: currYTUrl, state: 'PAUSED',room_id:room_id ,admin_token: admin_token});
  }
  
}


JsPlayer = videojs("js-player");
JsDiv = document.querySelector('#js-player');

var addJsListener = ()=>{
  if(!admin_token)return;

    JsPlayer.on("play", function (e) {
        if(JsLock) return;
        socket.emit('videoStateChanged',{type: currVideoType,time: JsPlayer.currentTime(),url: currJsUrl, state: 'PLAYING',room_id:room_id ,admin_token: admin_token});
    });

    JsPlayer.on("pause", function (e) {
       if(JsLock) return;
       socket.emit('videoStateChanged',{type: currVideoType,time: JsPlayer.currentTime(),url: currJsUrl, state: 'PAUSED',room_id:room_id ,admin_token: admin_token});
    });

    JsPlayer.on("seeked", function (e) {
        if(!JsPlayer.paused()){
          if(JsLock) return;
          socket.emit('videoStateChanged',{type: currVideoType,time: JsPlayer.currentTime(),url: currJsUrl, state: 'PLAYING',room_id:room_id ,admin_token: admin_token});
        }
        else{
          if(JsLock) return;
          socket.emit('videoStateChanged',{type: currVideoType,time: JsPlayer.currentTime(),url: currJsUrl, state: 'PAUSED',room_id:room_id ,admin_token: admin_token});
        }
    });
}


