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

const UsersSchema = mongoose.Schema({
    // profileimg: {
    //     type: String,
    //     required:false,
    //     default:'profiledefault.jpeg'
    // },
    firstname: {
        type: String,
        required:true
    },
    lastname: {
        type: String,
        required:true
    },
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    phone_number: {
        type: Number,
        required:true
    },
    county: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    }
    // },
    // isAdmin:{
    //     type: Boolean,
    //     required: false,
    //     default: false
    // }
})

module.exports = mongoose.model('Users_details',UsersSchema);