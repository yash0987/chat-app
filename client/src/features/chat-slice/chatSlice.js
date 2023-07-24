import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        value: []
    },

    reducers: {
        prependChat: (state, action) => {
            state.value = [...action.payload, ...state.value];
        },
        appendChat: (state, action) => {
            state.value = [...state.value, ...action.payload];
        },
        updateChat: (state, action) => {
            state.value = [...action.payload];
        },
        emptyChat: (state) => {
            state.value = [];
        }
    }
})

export const { prependChat, appendChat, updateChat, emptyChat } = chatSlice.actions;
export default chatSlice.reducer;