const mongoose = require ("mongoose")

const ChatSchema = new mongoose.Schema({
    members : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }]
    },
    lastmessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "messages"
    },
    unreadmessages : {
        type : Number,
        default : 0
    }
}, {timestamps : true})

module.exports = mongoose.model("chats", ChatSchema)