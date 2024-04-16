import { createSlice } from '@reduxjs/toolkit';

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState: {
        value: {
            editMessage: false,
            replyMessage: false,
            showProfile: false,
        }
    },
    reducers: {
        editMessageToggle: (state, action) => {
            state.value.editMessage = action.payload;
        },
        replyMessageToggle: (state, action) => {
            state.value.replyMessage = action.payload;
        },
        showProfileToggle: (state, action) => {
            state.value.showProfile = action.payload;
        },
        setTogglesToDefault: (state) => {
            state.value = { editMessage: false, replyMessage: false };
        }
    }
})

export const { editMessageToggle, replyMessageToggle, showProfileToggle, setTogglesToDefault } = toggleSlice.actions;
export default toggleSlice.reducer;