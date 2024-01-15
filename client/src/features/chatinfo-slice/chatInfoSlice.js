import { createSlice } from "@reduxjs/toolkit";

export const newChatSlice = createSlice({
    name: 'newchat',
    initialState: {
        value: {
            newChat: {},
            latestChat: {}
        }
    },
    reducers: {
        startNewChat: (state, action) => {
            state.value = { latestChat: state.value.newChat, newChat: action.payload };
        }
    }
})

export const { startNewChat } = newChatSlice.actions;
export default newChatSlice.reducer;