const jwt = require('jsonwebtoken');
const User = require('../model/User');
//verify token
module.exports = async function(req) {
    const token1 = req.cookies['jwt'];
    try{
        if(!token1) return null;
        const decoded = jwt.verify(token1,process.env.TOKEN_SECRET);
        const id = decoded._id;
        const currUser={};
        const user= await User.findOne({_id:id});
        if(!user)return null;
        currUser['name']=user.name;
        currUser['email']=user.email;
        currUser['id']=user._id;
        return currUser;

    }
    catch(err){
        console.log(err);
        return  null;
    }
}