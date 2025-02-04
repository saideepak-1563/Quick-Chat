import { axiosInsance, url } from "./index"


export const createNewMsg = async( message ) => {
    try {

        const response = await axiosInsance.post( url + '/api/message/createMessage', message)
        return response.data
        
    } catch (error) {
        return error.message
    }
}

export const getAllMsg = async( chatId ) => {
    try {

        const response = await axiosInsance.get( url + `/api/message/getmessage/${chatId}`)
        return response.data
        
    } catch (error) {
        return error.message
    }
}