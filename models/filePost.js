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

const FilesSchema = mongoose.Schema({
    filepath: {
        type: String,
        required:false,
    },
    username: {
        type: String,
        required:true
    }

})

module.exports = mongoose.model('Files_details',FilesSchema);