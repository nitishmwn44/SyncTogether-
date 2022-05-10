const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_name:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Room',roomSchema);