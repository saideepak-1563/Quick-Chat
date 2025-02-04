const router = require("express").Router()
const middleware = require("../middleware/middleware")
const Chat = require("../Models/Chat")
const Message = require("../Models/Message")

router.post("/createchat", middleware, async (req,res)=> {
    try {

        const chat = new Chat(req.body)
        const savedChat = await chat.save()

        await savedChat.populate("members")

        res.send({
            message : "Chat created Successfully",
            success : true,
            data : savedChat
        })
        
    } catch (error) {
        res.send({
            message : error.message,
            success : false
        })
    }
})

router.get("/getallchat", middleware, async (req,res)=> {
    try {

        const allChats = await Chat.find({members : {$in : req.body.userId}})
        .populate("members").populate("lastmessage").sort({updatedAt : -1})

        res.send({
            message : "Chat fetched Successfully",
            success : true,
            data : allChats
        })
        
    } catch (error) {
        res.send({
            message : error.message,
            success : false
        })
    }
})

router.post("/clearUnreadMsg", middleware, async(req,res) => {
    try {

        const chatId = req.body.chatId

        const chat = await Chat.findById(chatId)

        if(!chat){
            res.send({
                message : "no chat of id",
                success : false
            })
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {unreadmessages : 0},
            {new : true}
        ).populate('members').populate('lastmessage')

        await Message.updateMany(
            {chatId : chatId, read : false},
            {read : true}
        )
        
        res.send({
            message : "unread msg cleared succesfully",
            success : true,
            data : updatedChat
        })

    } catch (error) {
        res.send({
            message : error.message,
            success : false
        }) 
    }
})

module.exports = router