import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        value: [],
        chatLoadedCount: 0
    },
    reducers: {
        prependChat: (state, action) => {
            state.value = [...action.payload, ...state.value];
            state.chatLoadedCount += 40;
        },
        appendChat: (state, action) => {
            state.value = [...state.value, ...action.payload];
        },
        updateChat: (state, action) => {
            state.value = [...action.payload];
        },
        emptyChat: (state) => {
            state.value = [];
            state.chatLoadedCount = 0;
        }
    }
})

export const { prependChat, appendChat, updateChat, emptyChat } = chatSlice.actions;
export default chatSlice.reducer;