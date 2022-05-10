const mongoose = require('mongoose');

const socketSchema = new mongoose.Schema({
    socket_id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Socket',socketSchema);