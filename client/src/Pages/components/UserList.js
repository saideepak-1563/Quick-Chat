import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createNewChat } from '../../apiCalls/chat'
import { hideLoader, showLoader } from '../../redux/loaderSlice'
import { setAllChats, setSelectedChats } from '../../redux/userSlice'
import moment from 'moment'
import store from '../../redux/store'


const UserList = ({ searchKey, socket, onlineUser }) => {

    const { allUsers, allChats, user: currentUser, selectedChat } = useSelector(state => state.userReducer)

    const dispatch = useDispatch()

    const startNewChat = async (searchedUserId) => {

        let response = null

        try {
            dispatch(showLoader())
            response = await createNewChat([currentUser._id, searchedUserId])
            dispatch(hideLoader())

            if (response.success) {
                toast.success(response.message)
                const newChat = response.data
                const updatedChat = [...allChats, newChat]
                dispatch(setAllChats(updatedChat))
                dispatch(setSelectedChats(newChat))
            }

        } catch (error) {
            dispatch(hideLoader())
            toast.error(response.message)
        }
    }

    const openChat = (selectedUserId) => {
        const chat = allChats.find(chat =>
            chat.members.map(m => m._id).includes(currentUser._id) &&
            chat.members.map(m => m._id).includes(selectedUserId)
        )

        if (chat) {
            dispatch(setSelectedChats(chat))
        }
    }

    const isSelectedChat = (user) => {
        if (selectedChat) {
            return selectedChat.members.map(m => m._id).includes(user._id)
        }
        return false
    }

    const getLastMsg = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId))

        if (!chat || !chat?.lastmessage) {
            return ""
        } else {
            const msgPrefix = chat?.lastmessage?.sender === currentUser._id ? "You : " : ""
            return msgPrefix + chat?.lastmessage?.text?.substring(0, 25)
        }
    }

    const lastMsgTimeStamp = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId))

        if (!chat || !chat?.lastmessage) {
            return ""
        } else {
            return moment(chat?.lastmessage?.createdAt).format("hh:mm A")
        }
    }

    function formatName(user) {
        let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
        let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
        return fname + " " + lname
    }

    const getUnreadMsgCount = (userId) => {
        const chat = allChats.find(chat =>
            chat.members.map(m => m._id).includes(userId)
        )

        if (chat && chat.unreadmessages && chat.lastmessage.sender !== currentUser._id) {
            return <div className = "unread-msg-count"> {chat.unreadmessages} </div>
        } else {
            return ""
        }
    }

    function getdata(){
        if(searchKey === ''){
            return allChats
        }else{
            allUsers.filter(user =>{
                return user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
                user.lastname.toLowerCase().includes(searchKey.toLowerCase())
            })
        }
    }

    useEffect(()=> {
        socket.off('set-message-count').on('set-message-count', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat
            let allChat = store.getState().userReducer.allChats

            if(selectedChat?._id !== message.chatId){
                const updatedChats = allChat.map(chat => {
                    if(chat._id === message.chatId){
                        return {
                            ...chat,
                            unreadmessages : (chat?.unreadmessages || 0) + 1,
                            lastmessage : message
                        }
                    }
                    return chat
                })
                allChat = updatedChats
            }
            const latestChat = allChat.find(chat => chat._id === message.chatId)

            const otherChat = allChat.filter(chat => chat._id !== message.chatId)

            allChat = [latestChat, ...otherChat]

            dispatch(setAllChats(allChat))
        })
    },[])

    return (
            getdata().map(obj => {
                let user = obj
                if(obj.members){
                    user = obj.members.find(mem => mem._id !== currentUser._id)
                }
                return (
                    <div className="user-search-filter" onClick={() => openChat(user._id)} key={user._id} >
                        <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>
                            <div className="filter-user-display">

                                {user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image" 
                                style={onlineUser.includes(user._id)? {border : '#82e0aa 3px solid'} : {}} />}

                                {!user.profilePic && <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}
                                style={onlineUser.includes(user._id)? {border : '#82e0aa 3px solid'} : {}}
                                >
                                    {user.firstname.toUpperCase()[0] + user.lastname.toUpperCase()[0]}
                                </div>}
                                <div className="filter-user-details">
                                    <div className="user-display-name">{formatName(user)} </div>
                                    <div className="user-display-email">{getLastMsg(user._id) || user.email}</div>
                                </div>

                                <div>
                                    {getUnreadMsgCount(user._id)}
                                    <div className='last-msg-timestamp'> {lastMsgTimeStamp(user._id)} </div>

                                </div>

                                {!allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) &&
                                    <div className="user-start-chat">
                                        <button className="user-start-chat-btn"
                                            onClick={() => startNewChat(user._id)}>Start Chat</button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                )
            })

    )
}

export default UserList
