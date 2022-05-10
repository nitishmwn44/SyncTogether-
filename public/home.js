let currUser = {};
fetch("/user")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    if (data) {
      //user is loged in
      let createRoom = document.getElementById("create-room");
      createRoom.onclick = function (e) {
        e.preventDefault()
        dialogBox.style.display = "block";
      };

      let comps = document.getElementsByClassName("sign-in");
      [].forEach.call(comps, (element) => (element.style.display = "block"));
      let rems = document.getElementsByClassName("sign-out");
      [].forEach.call(rems, (element) => (element.style.display = "none"));
      let userName = document.getElementsByClassName("dropbtn")[0];
      userName.innerHTML =
        data.name.toUpperCase() +
        '<i class="fa fa-caret-down" style="margin-left: 10px;"></i>';
    } else {
      //not logged in
      let createRoom = document.getElementById("create-room");
      createRoom.setAttribute("href", "./sign_in.html");
    }
  })
  .catch((err) => {
    console.log(err);
  });

let logOutOpt = document.getElementById("log-out-opt");
logOutOpt.addEventListener("click", () => {
  fetch("auth/logout", {
    method: "post",
  })
    .then((res) => {
      if (res.status == 200) {
        //cookies successfully cleared
        location.reload();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

let createRoomBtn = document.getElementById("create-room");
let dialogBox = document.getElementById("dialog-box");

var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  dialogBox.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == dialogBox) {
    dialogBox.style.display = "none";
  }
};

let createRoomForm = document.getElementById("create-room-form");
createRoomForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(createRoomForm);
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });
  
  if (!confirm(`Do you want to create room by name ${jsonData['room_name']}`)) {
    dialogBox.style.display = "none";
    document.querySelector('.dialog-box-content input').value = '';
    return;
  }

  fetch('user/create_room',{
    method: 'post',
    body: JSON.stringify(jsonData),
    headers :{
      'Content-Type': 'application/json'
    }
  }).then((res)=>{
    if(res.redirected){
      window.location.href = res.url;
    }
  }).catch((err)=>{
    console.log(err);
  });
});

let roomOpt = document.getElementById('room-opt');
let flag = true;
roomOpt.addEventListener('click',()=>{
  let mainContainer = document.getElementsByClassName('container')[0];
  let roomContainer = document.getElementsByClassName('room-container')[0];
  if(flag){
    flag=false;
    mainContainer.style.display = 'none';
    roomContainer.style.display = 'block';
    roomOpt.innerHTML='Create Room';
  }
  else{
    flag=true;
    mainContainer.style.display = 'block';
    roomContainer.style.display = 'none';
    roomOpt.innerHTML='My Rooms';
  }
});


let getRoom = function(){
  let roomUl = document.getElementsByClassName('room-ul')[0];
  roomUl.innerHTML='';
  fetch('/user/get_room',{
    method: 'get'
  })
  .then(res=>{
    return res.json();
  })
  .then(data=>{
    updateList(data);
  })
  .catch(err=>{
    console.log(err);
  });
}

let roomUl = document.getElementsByClassName('room-ul')[0];
let item = document.getElementsByClassName('room-ul-li')[0];

let updateList = function(roomList){
  if(!roomList)retrun;
  
  roomList.forEach(room=>{
    let cln = item.cloneNode(true);
    cln.style.display='inherit'
    cln.getElementsByTagName('span')[0].innerHTML = room['room_name'];
    cln.getElementsByTagName('a')[0].addEventListener('click',()=>{
      window.location.replace(`/room/${room._id}`); 
    });
    cln.getElementsByTagName('a')[1].addEventListener('click',()=>{
      if(!confirm('Are you want to delete the room?'))return;
      fetch('user/delete_room',{
        method: 'delete',
        body: JSON.stringify({
          room_id: room._id
        }),
        headers :{
          'Content-Type': 'application/json'
        }
      })
      .then(res=>{
        getRoom();
        return res.json();
      })
      .then(data=>{
        console.log(data);
      })
      .catch(err=>{
        console.log(err);
      })
    });
    roomUl.appendChild(cln);
  });
}

getRoom();
