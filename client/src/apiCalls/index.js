import axios from 'axios'

export const url = "http://localhost:3001"

export const axiosInsance = axios.create({
    headers :{
        authorization : `Bearer ${localStorage.getItem("token")}`
    }
})