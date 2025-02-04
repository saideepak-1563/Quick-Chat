import { axiosInsance, url } from "./index"


export const getAllChats = async() => {
    try {

        const response = await axiosInsance.get( url + "/api/chat/getallchat")
        return response.data
        
    } catch (error) {
        return error
    }
}

export const createNewChat = async(members) => {
    try {

        const response = await axiosInsance.post( url + "/api/chat/createchat", {members})
        return response.data
        
    } catch (error) {
        return error
    }
}

export const clearUnreadMsg = async(chatId) => {
    try {

        const response = await axiosInsance.post( url + "/api/chat/clearUnreadMsg", {chatId : chatId})
        return response.data
        
    } catch (error) {
        return error
    }
}