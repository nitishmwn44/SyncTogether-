
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const path =  require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const stream = require('./routes/stream');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const roomRoute = require('./routes/room');
const Socket = require('./model/Socket');
const Room = require('./model/Room');
const User = require('./model/User');


const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

dotenv.config();

const staticPath = path.join(__dirname ,"../public");
app.use(express.json());
app.use(express.static(staticPath));

//connect to DB

mongoose.connect(process.env.DB_CONNECT,
  {useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection
.once('open',()=> console.log('connected'))
.on('error',(err)=>{
  console.log(err);
})

//auth middlewares
app.use('/auth',authRoute);
//stream middlewares
app.use('/stream',stream);
//user middlewares
app.use('/user',userRoute);
//room middleware
app.use('/room',roomRoute);



const port = process.env.PORT || '3000';
server.listen(port, () => console.log(`Server started on Port ${port}`));


var isAdmin = async (room_id,admin_token)=>{
  if(!admin_token) return false;
  if(!room_id) return false;
  const decoded = jwt.verify(admin_token,process.env.ADMIN_SECRET);
  const id = decoded._id;
  const currUser = await Room.findOne({_id: room_id, createdBy: id});
  if(currUser){
    return true;
  }
  else {
    return false;
  }
}
const serverName = 'Server';
const videoTypeNames = ['YouTube','Gdrive','Web','Local Stream','Synced']
//socket.io 
io.on('connection', socket => {

    socket.on('join',async (data) => {
        if(!data.name || !data.room){
          return;
        }
        
        socket.join(data.room);
        const token1 = data.jwt;
        const decoded = jwt.verify(token1,process.env.TOKEN_SECRET);
        const id = decoded._id;
        await Socket.deleteMany({user_id: id, room:data.room});

        const skt = new Socket({
          socket_id: socket.id,
          name: data.name,
          room: data.room,
          user_id: id
        });
        try{
          const savedSkt = await skt.save();
        }
        catch(err){
          console.log(err);
          return;
        }

        socket.to(data.room).emit('AdminMessage', {
        name: serverName,
        message: `${data.name.toUpperCase()} has joined!`,
        time: data.time
        });

        io.to(socket.id).emit('AdminMessage',{
        name: serverName,
        message: `Hi..${data.name.toUpperCase()} to the room`,
        time: data.time
        });


    });

  socket.on('sendMessage', data => {
    socket.broadcast.to(data.room).emit('message',data );
  });

  socket.on('disconnect',async ()=> {
    const skt= await Socket.findOne({socket_id: socket.id});
    if(!skt){
      return;
    }
    io.to(skt.room).emit('AdminMessage', {
        name: serverName,
        message: `${skt.name.toUpperCase()} has left.`,
        time: { type:'date', 'min':new Date().getTime() }
        });
    await skt.delete();
    });

   socket.on('videoStateChanged',async (data)=>{
     const check = await isAdmin(data.room_id,data.admin_token);
     if(!check) return;
     socket.broadcast.to(data.room_id).emit('stateChanged',data);
   });

   socket.on('getState',async (data)=>{
     const room_id = data.room_id;
     const room = await Room.findById({_id: room_id});
     if(!room) return;
     const admin_uid = room.createdBy;
     const admSkt = await Socket.findOne({user_id: admin_uid,room: room_id});
     if(!admSkt) return;
     io.to(admSkt.socket_id).emit('notifyState',{to: socket.id});

   });

   socket.on('notifyUser',async (data)=>{
    const check = await isAdmin(data.data.room_id,data.data.admin_token);
    if(!check) return;
    io.to(data.to).emit('stateChanged',data.data);
   });

   socket.on('newVideo',(data)=>{
     let type = data.type;
     io.to(data.room_id).emit('AdminMessage',{
      name: serverName,
      message: `New ${videoTypeNames[type]} video added.If Not synced please do so by clicking on "syncMe"`,
      time: { type:'date', 'min':new Date().getTime() }
      });

   });
    
});

