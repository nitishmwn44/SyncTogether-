const express = require('express');
const app = express();
const router = express.Router();
const Room = require('../model/Room');
const mongoose = require('mongoose');
const path = require('path');
const verifyToken = require('./verifyToken');
const jwt = require('jsonwebtoken')

router.get('/:room_id',async (req,res)=>{
    const currUser = await verifyToken(req);
    if(!currUser){
        res.redirect('/');
        return;
    }
    const room_id = req.params['room_id'];
    //find if the room with room_id exist or not
    if(!mongoose.Types.ObjectId.isValid(room_id)){
        res.json('room not exist');
        return;
    }
    const room = await Room.findOne({_id: room_id});
    if(!room){
        //room does not exist
        res.json('room not exist');
    }
    else{
        res.sendFile(path.join(__dirname,'../../public/room.html'));
    }
});

router.post('/get_admin_token',async (req,res) =>{
    const currUser = await verifyToken(req);
    const room = await Room.findOne({_id: req.body.room_id,createdBy: currUser.id});
    if(room){
        const token1 = jwt.sign({_id: currUser.id},process.env.ADMIN_SECRET);
        res.json({admin_token: token1, name: currUser.name});
    }
    else{
        res.json({name: currUser.name});
    }
});

module.exports = router;