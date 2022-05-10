var urlParams = new URLSearchParams(window.location.search);
var username='NA';
var admin_token = null;
var room_id=getValueAtIndex(4).toString();
const socket = io();
const jwt = getCook('jwt');
var temp = 0;

fetch('get_admin_token',{
    method: 'post',
    body: JSON.stringify({room_id: room_id}),
    headers :{
      'Content-Type': 'application/json'
    }
  })
.then(res=>{
    return res.json();
})
.then(data=>{
    if(!data)window.location.replace('/');
    if(!data.name)window.location.replace('/');
    username=data.name;
    if(data.admin_token){
        $.getScript('../localVideoBroadcast.js');
        admin_token = data.admin_token;
        addJsListener();
        syncAllFun();
        temp++;
        if(temp==2){
            YtFun();
        }
    }
    else{
        $.getScript('../localVideoView.js');
        syncMeFun();
        temp++;
        if(temp==2){
            YtFun();
        }
    }
    socket.emit('join',{name: username,admin_token: admin_token,jwt: jwt, room: room_id,time: { type:'date', 'min':new Date().getTime() }});
    
    
})
.catch(err=>{
    console.log(err);
    // window.location.replace('/','?');
});



socket.on('connect', () => {

});

socket.on('message',(data)=>{
    createLeftMessage(data);
});
socket.on('AdminMessage',(data)=>{
    createAdminMessage(data);
})

function updateScroll(){
    var element = document.getElementsByClassName('msger-chat')[0];
    element.scrollTop = element.scrollHeight;
}

//creating left element and right element using DOM
let createLeftMessage = function(data){
    let name= data.name;
    let message = data.message;
    let time = new Date(data.time.min);
    timeStr = time.getHours()+':'+time.getMinutes();
    
    
    let elm = document.getElementsByClassName('left-msg')[0];
    let cln = elm.cloneNode(true);
    let chatThread = document.getElementsByClassName('msger-chat')[0];
    //changing data of cln 
    cln.getElementsByClassName('msg-info-name')[0].innerHTML= name;
    cln.getElementsByClassName('msg-info-time')[0].innerHTML= timeStr;
    cln.getElementsByClassName('msg-text')[0].innerHTML= message;
    cln.style.display = 'flex';
    // cln.getElementsByClassName('msg-img')[0].style.backgroundImage = 'url('+imageUrl+')';


    //appending cln to chat thread
    chatThread.appendChild(cln);
    updateScroll();
}

//creating right element and right element using DOM
let createRightMessage = function(data){
    let name= data.name;
    let message = data.message;
    let time = new Date(data.time.min);
    timeStr = time.getHours()+':'+time.getMinutes();
    
    
    let elm = document.getElementsByClassName('right-msg')[0];
    let cln = elm.cloneNode(true);
    let chatThread = document.getElementsByClassName('msger-chat')[0];
    cln.style.display = 'flex';
    //changing data of cln 
    cln.getElementsByClassName('msg-info-name')[0].innerHTML= name;
    cln.getElementsByClassName('msg-info-time')[0].innerHTML= timeStr;
    cln.getElementsByClassName('msg-text')[0].innerHTML= message;
    // cln.getElementsByClassName('msg-img')[0].style.backgroundImage = 'url('+imageUrl+')';


    //appending cln to chat thread
    chatThread.appendChild(cln);
    updateScroll();
}


let createAdminMessage = function(data){
    let name= data.name;
    let message = data.message;
    let time = new Date(data.time.min);
    timeStr = time.getHours()+':'+time.getMinutes();
    
    
    let elm = document.getElementsByClassName('admin-msg')[0];
    let cln = elm.cloneNode(true);
    let chatThread = document.getElementsByClassName('msger-chat')[0];
    cln.style.display = 'flex';
    //changing data of cln 
    cln.getElementsByClassName('msg-info-name')[0].innerHTML= name;
    cln.getElementsByClassName('msg-info-time')[0].innerHTML= timeStr;
    cln.getElementsByClassName('msg-text')[0].innerHTML= message;
    // cln.getElementsByClassName('msg-img')[0].style.backgroundImage = 'url('+imageUrl+')';


    //appending cln to chat thread
    chatThread.appendChild(cln);
    updateScroll();
}


//send message on click
const sendMessageForm = document.getElementById('send-message');
sendMessageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formData = new FormData(sendMessageForm);
    const jsonData = {};
    formData.forEach((value,key)=>{
        jsonData[key]=value;
    });
    sendMessageForm.reset();
    jsonData['name']=username;
    jsonData['time']={ type:'date', 'min':new Date().getTime() };
    jsonData['room']=room_id;
    console.log(jsonData);
    socket.emit('sendMessage',jsonData);
    createRightMessage(jsonData);
});

function getValueAtIndex(index){
    var str = window.location.href; 
    str = str.split("?")[0];
    return str.split("/")[index];
}

function getCook(cookiename) 
  {
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
  }



  socket.on('stateChanged',(data)=>{
      if(admin_token)return;
      let type = data.type;
      let url = data.url;
      let state = data.state;
      let time = data.time;
      if(url || type == 4)currVideoType = type;
      YtDiv = document.querySelector('#yt-player');
      if(type == 0){
        if(isLocalStream){
            isLocalStream = false;
            removeView();
        }
        if(isSyncVideo) isSyncVideo = false;
          if(url){
              YtDiv.style.display = 'block';
              JsDiv.style.display = 'none';
              localPlayer.style.display = 'none';
          }
          if(currYTUrl!=url){
              currYTUrl = url;
              currJsUrl = '';
              YtPlayer.loadVideoById({videoId: url,startSeconds: time});
              JsPlayer.src('a.mp4');
          }
          YtPlayer.seekTo(time);
          if(state == 'PLAYING'){
              YtPlayer.playVideo();
          }
          else if(state == 'PAUSED'){
              YtPlayer.pauseVideo();
          }
          
      }
      else if(type == 1 || type == 2){
        if(isLocalStream){
            isLocalStream = false;
            removeView();
        }
        if(isSyncVideo) isSyncVideo = false;
          if(url){
              JsDiv.style.display = 'block';
              YtDiv.style.display = 'none';
              localPlayer.style.display = 'none';
          }
          if(currJsUrl != url){
            currYTUrl = '';
            currJsUrl = url;
            YtPlayer.loadVideoById({videoId: '',startSeconds: time});
            JsPlayer.src(url);
          }
          JsPlayer.currentTime(time);
          if(state == 'PLAYING'){
              JsPlayer.play();
          }
          else if(state == 'PAUSED'){
            JsPlayer.pause();
          }

      }
      else if(type == 3){
          //local streaming
          if(isSyncVideo) isSyncVideo = false;
          if(url){
            JsDiv.style.display = 'none';
            YtDiv.style.display = 'none';
            localPlayer.style.display = 'block';
          }
          if(currJsUrl != url){
            if(isLocalStream){
                isLocalStream = false;
                removeView();
            }
            currYTUrl = '';
            currJsUrl = url;
            YtPlayer.loadVideoById({videoId: '',startSeconds: time});
            JsPlayer.src('a.mp4');
            viewVideo(currJsUrl);
          }
          else{
            localPlayer.currentTime = time;
            if(state == 'PLAYING'){
                localPlayer.play();
            }
            else if(state == 'PAUSED'){
                localPlayer.pause();
            }
          }
          
      }
      else if(type == 4){
          //sync video
          if(isLocalStream){
            isLocalStream = false;
            removeView();
          }
          if(url){
            JsDiv.style.display = 'block';
            YtDiv.style.display = 'none';
            localPlayer.style.display = 'none';
          }
          if(!isSyncVideo){
            //ALERT TO SYNC
            YtPlayer.loadVideoById({videoId: '',startSeconds: 0});
            localPlayer.src = '';
            JsPlayer.src('a.mp4')
            currJsUrl = '';
            currYTUrl = '';
            JsDiv.style.display = 'block';
            YtDiv.style.display = 'none';
            localPlayer.style.display = 'none';
            alert('Please add the video to be synced !');
            
          }
          else{
            JsPlayer.currentTime(time);
            if(state == 'PLAYING'){
                JsPlayer.play();
            }
            else if(state == 'PAUSED'){
                JsPlayer.pause();
            }
          }

      }
      
  });

  socket.on('notifyState',(skt_data)=>{
    let data = {};
    data['type'] = currVideoType;
    if(currVideoType == 0){
        if(!currYTUrl) return;
        data['url'] = currYTUrl;
        data['time'] = YtPlayer.getCurrentTime();
        if(YtPlayer.getPlayerState() == YT.PlayerState.PLAYING) data['state'] = 'PLAYING';
        else if( YtPlayer.getPlayerState() == YT.PlayerState.PAUSED) data['state'] = 'PAUSED';
    }
    else if(currVideoType == 1 || currVideoType == 2){
        if(!currJsUrl)return;
        data['url'] = currJsUrl;
        data['time'] = JsPlayer.currentTime();
        if(!JsPlayer.paused()) data['state'] = 'PLAYING';
        else data['state'] = 'PAUSED';
    }
    else if(currVideoType == 3){
        if(JsLock)return;
        if(!currJsUrl)return;
        data['url'] = currJsUrl;
        data['time'] = JsPlayer.currentTime();
        if(!JsPlayer.paused()) data['state'] = 'PLAYING';
        else data['state'] = 'PAUSED';

    }
    else if(currVideoType == 4){
        data['url'] = currJsUrl;
        data['time'] = JsPlayer.currentTime();
        if(!JsPlayer.paused()) data['state'] = 'PLAYING';
        else data['state'] = 'PAUSED';
    }
    data['room_id'] = room_id;
    data['admin_token'] = admin_token;
    const main_data ={};
    main_data['data']=data;
    main_data['to']=skt_data.to;
    socket.emit('notifyUser',main_data);
  });




  function _handleClick(event) {
    event.preventDefault();
  
    var textarea = document.createElement("textarea");
  
    textarea.style.position = 'fixed';
    textarea.style.top = '-1px';
    textarea.style.left = '-1px';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.opacity = 0;
    textarea.style.pointerEvents = 'none';
  
    textarea.value = window.location.href;
  
    document.body.appendChild(textarea);
  
    textarea.select();
  
    try {
      var copiedURL = document.execCommand('copy');
      if (copiedURL) {
        alert('URL Copied');
      } else {
        console.log('Copy failed');
      }
    } catch (err) {
      console.log('Copy failed',err);
    }
  
    document.body.removeChild(textarea);
  }
  
  document.getElementsByClassName('clipboard')[0].addEventListener('click',_handleClick,false);

  const syncBtn = document.getElementById('sync-btn');

  var syncMeFun = ()=>{
      syncBtn.innerHTML = 'Sync Me';
      syncBtn.addEventListener('click',(e)=>{
          socket.emit('getState',{room_id: room_id});
      });
  }

  var syncAllFun = ()=>{
      syncBtn.innerHTML = 'Sync All';
      syncBtn.addEventListener('click',(e)=>{
        let data = {};
        data['type'] = currVideoType;
        if(currVideoType == 0){
            if(!currYTUrl) return;
            data['url'] = currYTUrl;
            data['time'] = YtPlayer.getCurrentTime();
            if(YtPlayer.getPlayerState() == YT.PlayerState.PLAYING) data['state'] = 'PLAYING';
            else if( YtPlayer.getPlayerState() == YT.PlayerState.PAUSED) data['state'] = 'PAUSED';
        }
        else if(currVideoType == 1 || currVideoType == 2){
            if(!currJsUrl)return;
            data['url'] = currJsUrl;
            data['time'] = JsPlayer.currentTime();
            if(!JsPlayer.paused()) data['state'] = 'PLAYING';
            else data['state'] = 'PAUSED';
        }
        else if(currVideoType == 3){
            if(JsLock)return;
            if(!currJsUrl)return;
            data['url'] = currJsUrl;
            data['time'] = JsPlayer.currentTime();
            if(!JsPlayer.paused()) data['state'] = 'PLAYING';
            else data['state'] = 'PAUSED';
        }
        else if(currVideoType == 4){
            data['url'] = currJsUrl;
            data['time'] = JsPlayer.currentTime();
            if(!JsPlayer.paused()) data['state'] = 'PLAYING';
            else data['state'] = 'PAUSED';
        }
        data['room_id'] = room_id;
        data['admin_token'] = admin_token;
        socket.emit('videoStateChanged',data);
      });
     
  }