import { createSlice } from '@reduxjs/toolkit';

export const selectMessageSlice = createSlice({
    name: 'selectmessage',
    initialState: {
        value: [],
    },
    reducers: {
        selectMessage: (state, action) => {
            state.value.push(action.payload);
        },
        unselectAllMessages: (state) => {
            state.value = [];
        }
    }
})

export const { selectMessage, unselectMessage, unselectAllMessages } = selectMessageSlice.actions;
export default selectMessageSlice.reducer;