import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : {
        user : null,
        allUsers : [],
        allChats : [],
        selectedChat : null
    },
    reducers : {
        setUser : (state, action) => {state.user = action.payload},
        setAllUser : (state, action) => {state.allUsers = action.payload},
        setAllChats : (state, action) => {state.allChats = action.payload},
        setSelectedChats : (state, action) => {state.selectedChat = action.payload},
    }
})

export const { setUser, setAllUser, setAllChats, setSelectedChats } = userSlice.actions
export default userSlice.reducer