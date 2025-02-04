import React, { useEffect, useState } from 'react'
import Headers from './components/Headers'
import SideBar from './components/SideBar'
import ChatArea from './components/ChatArea'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const socket = io("http://localhost:3001")

const Home = () => {
  const { selectedChat, user } = useSelector(state => state.userReducer)
  const[onlineUser, setOnlineUser] = useState([])

  useEffect(() => {

    if (user) {
      socket.emit('join-room', user._id)
      socket.emit('user-login', user._id)

      socket.on('online-user',onlineUsers => {
        setOnlineUser(onlineUsers)
      })

      socket.on('online-user-updated',onlineUsers => {
        setOnlineUser(onlineUsers)
      })

    }

  }, [user])

  return (
    <div className="home-page">
      <Headers socket={socket} />
      <div className="main-content">
        {/*<!--SIDEBAR LAYOUT-->*/}
        <SideBar socket={socket} onlineUser ={onlineUser} />

        {/*<!--CHAT AREA LAYOUT-->*/}
        {selectedChat && <ChatArea socket={socket} />}
      </div>
    </div>
  )
}

export default Home
