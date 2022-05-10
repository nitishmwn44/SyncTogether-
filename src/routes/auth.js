
const express = require('express');
const router = express.Router();
const User = require('../model/User');
const validation =require('../validation');
const jwt = require('jsonwebtoken');


router.post('/register',async (req,res)=>{
    const {error} = validation.registerValidation(req.body); 
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //checking if user already registered with email
    
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist){
        return res.status(400).send('Email already exist');
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    
    try{
       const savedUser = await user.save(); 
       //create and asign a token
        const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
        res.cookie('jwt',token);
        res.json('success');
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res)=>{
    const {error} = validation.loginValidation(req.body); 
    
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //checking if user registered with email
    
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('Email doen not exist');
    }

    //password is not correct
    if(req.body.password !== user.password){
        return res.status(400).send('Invalid Password')
    }

    //create and asign a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    
    res.cookie('jwt',token);
    res.json('success');

});

router.post('/logout',(req,res)=>{
    res.clearCookie('jwt');
    res.json('token cleared');
});


module.exports = router;