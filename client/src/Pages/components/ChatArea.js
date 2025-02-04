import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewMsg, getAllMsg } from '../../apiCalls/message'
import { hideLoader, showLoader } from '../../redux/loaderSlice'
import { clearUnreadMsg } from '../../apiCalls/chat'
import toast from 'react-hot-toast'
import moment from 'moment'
import store from '../../redux/store'
import { setAllChats } from '../../redux/userSlice'
import EmojiPicker from 'emoji-picker-react'

const ChatArea = ({ socket }) => {

    const dispatch = useDispatch()

    const { selectedChat, user, allChats } = useSelector(state => state.userReducer)
    const selectedUser = selectedChat.members.find(u => u._id !== user._id)

    const [message, setMessage] = useState("")
    const [allMessage, setAllMessage] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)
    const [data, setData] = useState(false)

    const sendMessage = async (image) => {
        try {

            const newMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
                image : image
            }

            socket.emit('send-msg', {
                ...newMessage,
                members: selectedChat.members.map(m => m._id),
                read: false,
                createdAt: moment().format('DD-MM-YY hh:mm:ss')
            })

            const response = await createNewMsg(newMessage)

            if (response.success) {
                setMessage("")
                setShowEmoji(false)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMessagesfFromDb = async () => {
        try {

            dispatch(showLoader())
            const response = await getAllMsg(selectedChat._id)
            dispatch(hideLoader())

            if (response.success) {
                setAllMessage(response.data)
            }

        } catch (error) {
            dispatch(hideLoader())
            toast.error(error.message)
        }
    }

    const clearUnreadMsgCount = async () => {
        try {

            socket.emit('clear-unread-msg', {
                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id)
            })

            const response = await clearUnreadMsg(selectedChat._id)

            if (response.success) {
                allChats.map(chat => {
                    if (chat._id === selectedChat._id) {
                        return response.data
                    }
                    return chat
                })
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const formatTime = (timestamp) => {
        const now = moment()

        const diff = now.diff(moment(timestamp), 'days')

        if (diff < 1) {
            return `Today ${moment(timestamp).format('hh:mm A')}`
        } if (diff == 1) {
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`
        } else {
            return moment(timestamp).format('MMM D, hh:mm A')
        }
    }

    const sendImage = async(e) => {
        const file = e.target.files[0]
        const reader = new FileReader(file)

        reader.readAsDataURL(file)

        reader.onloadend = async() => {
            sendMessage(reader.result)
        }
    }


    function formatName(user) {
        let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
        let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
        return fname + " " + lname
    }


    useEffect(() => {
        getMessagesfFromDb()
        if (selectedChat?.lastmessage?.sender !== user._id) {
            clearUnreadMsgCount()
        }

        socket.off('receive-msg').on('receive-msg', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat
            if (selectedChat._id === message.chatId) {
                setAllMessage(prevmsg => [...prevmsg, message])
            }

            if (selectedChat._id === message.chatId && message.sender !== user._id) {
                clearUnreadMsgCount()
            }
        })

        socket.on('msg-count-cleared', data => {
            const selectedChat = store.getState().userReducer.selectedChat
            const allChat = store.getState().userReducer.allChats

            if (selectedChat._id === data.chatId) {
                const updatedChat = allChat.map(chat => {
                    if (chat._id === data.chatId) {
                        return {
                            ...chat,
                            unreadmessages: 0
                        }
                    }
                    return chat
                })
                dispatch(setAllChats(updatedChat))

                setAllMessage(prevMsg => {
                    return prevMsg.map(msg => {
                        return { ...msg, read: true }
                    })
                })
            }
        })

        socket.on('started-typing', (data) => {
            setData(data)
            if (selectedChat._id === data.chatId && data.sender !== user._id) {
                setIsTyping(true)
                setTimeout(() => {
                    setIsTyping(false)

                }, 2000)
            }
        })

    }, [selectedChat])

    useEffect(() => {

        const msgContainer = document.getElementById('main-chat-area')
        msgContainer.scrollTop = msgContainer.scrollHeight
    }, [allMessage, isTyping])

    return (
        <>
            {selectedChat &&
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {formatName(selectedUser)}
                    </div>


                    <div className='main-chat-area' id='main-chat-area'>
                        {allMessage.map(msg => {

                            const isCurrentUserSender = msg.sender === user._id

                            return <div className="message-container" style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
                                <div>
                                    <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                                    <div>{msg.text}</div> 
                                    <div>{msg.image && <img src={msg.image} alt='image' height="120" width='120' />}</div>
                                    </div>
                                    <div className='message-timestamp' style={isCurrentUserSender ? { float: 'right' } : { float: 'left' }}>
                                        {formatTime(msg.createdAt)} {isCurrentUserSender && msg.read &&
                                            <i className='fa fa-check-circle' aria-hidden="true" style={{ color: "#e74c3c" }} ></i>}
                                    </div>
                                </div>
                            </div>
                        })}

                        <div className='typing-indicator'> {isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && <i>typing..</i>} </div>

                    </div>

                    {showEmoji &&
                        <div style={{width : "100%", display: 'flex', padding : '0px 20px', justifyContent : 'right'}}>
                            <EmojiPicker style={{width : '300px', height: '400px'}} onEmojiClick={(e) => setMessage(message + e.emoji)} />
                        </div>
                    }


                    <div className="send-message-div">
                        <input type="text" className="send-message-input" placeholder="Type a message"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                                socket.emit("user-typing", {
                                    chatId: selectedChat._id,
                                    members: selectedChat.members.map(m => m._id),
                                    sender: user._id
                                })
                            }} />

                        <label for="file">
                            <i className='fa fa-picture-o send-image-btn'></i>
                            <input 
                            type='file' 
                            id='file' 
                            style={{display : 'none'}} 
                            accept='imgage/jpg,image/png,image/jpeg,image/gif'
                            onChange={sendImage} />
                        </label>
                        <button className="fa fa-smile-o send-emoji-btn" aria-hidden="true"
                            onClick={() => { setShowEmoji(!showEmoji) }}></button>

                        <button className="fa fa-paper-plane send-message-btn" aria-hidden="true"
                            onClick={() => sendMessage('')}></button>

                    </div>
                </div>
            }
        </>
    )
}

export default ChatArea
