import { createSlice } from "@reduxjs/toolkit";

export const newChatSlice = createSlice({
    name: 'chatinfo',
    initialState: {
        value: {
            _id: "",
            name: "",
            aboutme: "",
            doj: ""
        }
    },
    reducers: {
        setChatProfile: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setChatProfile } = newChatSlice.actions;
export default newChatSlice.reducer;