import { createSlice } from '@reduxjs/toolkit';

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState: {
        value: {
            replyMessage: false,
            showProfile: false,
        }
    },
    reducers: {
        replyMessageToggle: (state, action) => {
            state.value.replyMessage = action.payload;
        },
        showProfileToggle: (state, action) => {
            state.value.showProfile = action.payload;
        },
        setTogglesToDefault: (state) => {
            state.value = { showStarredMessages: false, replyMessage: false };
        }
    }
})

export const { replyMessageToggle, showProfileToggle, setTogglesToDefault } = toggleSlice.actions;
export default toggleSlice.reducer;