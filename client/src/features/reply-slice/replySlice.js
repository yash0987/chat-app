import { createSlice } from "@reduxjs/toolkit";

export const replySlice = createSlice({
    name: 'reply',
    initialState: {
        value: {
            replyToPerson: null,
            replyForMessage: null,
        }
    },
    reducers: {
        reply: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { reply } = replySlice.actions;
export default replySlice.reducer;