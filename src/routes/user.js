const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const Room = require('../model/Room');
const jwt = require('jsonwebtoken');

const tokenVarificationMiddleware = async function(req,res,next){
    const currUser = await verifyToken(req);
    if(!currUser){
        res.status(400).json(currUser);
        return;
    }
    req.body.currUser = currUser;
    next();
}

router.use(tokenVarificationMiddleware);

router.get('/',async (req,res)=>{
    req.body.currUser.id = null;
    res.json(req.body.currUser);
});

router.post('/create_room',(req,res)=>{
    const id = req.body.currUser.id;
    req.body.currUser.id = null;
    
    const room = new Room({
        room_name: req.body.room_name,
        createdBy: id
    })
    try{
        const savedRoom = room.save();
        res.redirect('/');
    }
    catch(err){
        res.status(400).json(err);
    }
});

router.get('/get_room',(req,res)=>{
    const id = req.body.currUser.id;
    req.body.currUser.id = null;

    Room.find({createdBy: id})
        .then(rooms=>{
            res.send(rooms);
        })
        .catch(err=>{
            res.send(400).json(err);
        });
})

router.delete('/delete_room',(req,res)=>{
    const id = req.body.currUser.id;
    req.body.currUser.id = null;

    const room_id = req.body.room_id;
    Room.deleteMany({_id:room_id,createdBy: id})
        .then(()=>{
            res.json('deleted successfully');
        })
        .catch(err=>{
            console.log(err);
            res.status(400).json('Not deleted .. access denied');
        })
});

module.exports = router;