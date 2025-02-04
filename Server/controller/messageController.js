const router = require("express").Router()
const middleware = require("../middleware/middleware")
const Message = require("../Models/Message")
const Chat = require("../Models/Chat")


router.post("/createMessage",middleware, async(req,res) => {
    try {

        const newMessage = new Message(req.body)
        const savedMessage = await newMessage.save()

        // const currentChat = await Chat.findById(req.body.chatId)
        // currentChat.lastmessage = savedMessage._id
        // await currentChat.save()

        const currentChat = await Chat.findOneAndUpdate({
            _id : req.body.chatId
        },{
            lastmessage : savedMessage._id,
            $inc : {unreadmessages : 1}
        })

        res.send({
            message : "message Send Successfully",
            success : true,
            data : savedMessage
        })

        
    } catch (error) {
        res.send({
            message : error.message,
            success: false
        })
    }
} )


router.get("/getmessage/:chatId", middleware, async(req,res)=> {
    try {

        const allMsgs = await Message.find({chatId : req.params.chatId})
        .sort({createdAt : 1})

        res.send({
            message : "message fetched Successfully",
            success : true,
            data : allMsgs
        })

        
    } catch (error) {
        res.send({
            message : error.message,
            success: false
        }) 
    }
})

module.exports = router