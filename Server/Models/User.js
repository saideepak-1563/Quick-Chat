const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required : true
    },
    lastname: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    profilePic : {
        type : String,
        required : false
    }
}, {timestamps : true})

module.exports = new mongoose.model("users", UserSchema)