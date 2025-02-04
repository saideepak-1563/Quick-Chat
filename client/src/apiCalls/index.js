import axios from 'axios'

export const url = "https://deepak-chat-amr6.onrender.com"

export const axiosInsance = axios.create({
    headers :{
        authorization : `Bearer ${localStorage.getItem("token")}`
    }
})