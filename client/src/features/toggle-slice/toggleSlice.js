import { createSlice } from '@reduxjs/toolkit';

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState: {
        value: {
            toggleFeatures: false,
            showStarredMessages: false,
            replyMessage: false,
            showProfile: false,
        }
    },
    reducers: {
        featuresToggle: (state, action) => {
            state.value.toggleFeatures = action.payload;
        },
        starMessagesToggle: (state, action) => {
            state.value.showStarredMessages = action.payload;
        },
        replyMessageToggle: (state, action) => {
            state.value.replyMessage = action.payload;
        },
        showProfileToggle: (state, action) => {
            state.value.showProfile = action.payload;
        },
        setTogglesToDefault: (state) => {
            state.value = { toggleFeatures: false, showStarredMessages: false, replyMessage: false };
        }
    }
})

export const { featuresToggle, starMessagesToggle, replyMessageToggle, showProfileToggle, setTogglesToDefault } = toggleSlice.actions;
export default toggleSlice.reducer;