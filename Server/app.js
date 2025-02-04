const express = require("express")
const cros = require("cors")
const app = express()
const authRouter = require('./controller/authController')
const userRouter = require('./controller/userController')
const chatRouter = require('./controller/ChatController')
const messageRouter = require('./controller/messageController')

app.use(cros())

app.use(express.json({
    limit : "20mb"
}))
const server = require('http').createServer(app)

const io = require('socket.io')(server,{cors: {
    origin: 'http://localhost:3000',
    methods : ['GET', 'POST']
}})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)

const onlineUser = []


io.on('connection', socket => {
    socket.on('join-room', userid => {
        socket.join(userid)
    })

    socket.on('send-msg', (message) => {
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('receive-msg', message)

        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('set-message-count', message)
    })

    socket.on('clear-unread-msg', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('msg-count-cleared', data)
    })

    socket.on('user-typing', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('started-typing', data)
    })

    socket.on('user-login', userId => {
        if(!onlineUser.includes(userId)){
            onlineUser.push(userId)
        }
        socket.emit('online-user', onlineUser)
    })

    socket.on('user-offline', userId => {
        onlineUser.splice(onlineUser.indexOf(userId),1)
        socket.emit('online-user-updated', onlineUser)
    })
})


module.exports = server