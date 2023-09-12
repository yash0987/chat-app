import { createSlice } from '@reduxjs/toolkit';

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState: {
        value: {
            toggleFeatures: false,
            showStarredMessages: false,
            replayMessage: false
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
            state.value.replayMessage = action.payload;
        },
        setTogglesToDefault: (state) => {
            state.value = { toggleFeatures: false, showStarredMessages: false, replayMessage: false };
        }
    }
})

export const { featuresToggle, starMessagesToggle, replyMessageToggle, setTogglesToDefault } = toggleSlice.actions;
export default toggleSlice.reducer;