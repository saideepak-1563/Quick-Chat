import { axiosInsance, url } from "./index"

export const getLoginUser = async () => {
    try {
        const response = await axiosInsance.get( url + "/api/user/getlogginuser")
        return response.data
    } catch (error) {
        return error
    }
}

export const getAllUser = async () => {
    try {
        const response = await axiosInsance.get( url + "/api/user/getalluser")
        return response.data
    } catch (error) {
        return error
    }
}

export const uploadProfilePic = async (image) => {
    try {
        const response = await axiosInsance.post( url + "/api/user/upload-profile-pic",{image})
        return response.data
    } catch (error) {
        return error
    }
}