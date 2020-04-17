/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true,useUnifiedTopology: true }, ()=>{
});

const RoomSchema = mongoose.Schema({
    adminuser: {
        type: String,
        required:true
    },
    roomID: {
        type: String,
        required:true
    },
})

module.exports = mongoose.model('Room_details',RoomSchema);