import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoginUser, getAllUser } from '../apiCalls/users'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../redux/loaderSlice'
import toast from 'react-hot-toast'
import {setAllUser, setUser, setAllChats} from '../redux/userSlice'
import { getAllChats } from '../apiCalls/chat'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.userReducer)

  const getLoggedUser = async () => {
    let response = null

    try {

      dispatch(showLoader())
      response = await getLoginUser()
      dispatch(hideLoader())

      if (response.success) {
        dispatch(setUser(response.data))
      } else {
        toast.error(response.message)
        navigate('/login')
      }

    } catch (error) {
      dispatch(hideLoader())
      navigate('/login')
    }
  }

  const getAllUsersFromDB = async () => {
    let response = null

    try {

      dispatch(showLoader())
      response = await getAllUser()
      dispatch(hideLoader())

      if (response.success) {
        dispatch(setAllUser(response.data))
      } else {
        toast.error(response.message)
        navigate('/login')
      }

    } catch (error) {
      dispatch(hideLoader())
      navigate('/login')
    }
  }

  const getCurrentUserChats = async() => {
    try {

      const response = await getAllChats()

      if(response.success){
        dispatch(setAllChats(response.data))
      }
      
    } catch (error) {
      navigate("/login")
    }
  }

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        getLoggedUser()
        getAllUsersFromDB()
        getCurrentUserChats()
      } else {
        navigate('/login')
      }
    } catch (error) {
      return error
    }
  },[])

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute
