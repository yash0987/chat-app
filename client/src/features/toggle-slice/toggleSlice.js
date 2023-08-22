import { createSlice } from '@reduxjs/toolkit';

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState: {
        value: {
            toggleFeatures: false,
            showStarredMessages: false,
        }
    },
    reducers: {
        toggleFeatures: (state) => {
            state.value.toggleFeatures = !state.value.toggleFeatures;
        },
        showStarredMessages: (state) => {
            state.value.showStarredMessages = !state.value.showStarredMessages;
        },
        setTogglesToDefault: (state) => {
            state.value = { toggleFeatures: false, showStarredMessages: false };
        }
    }
})

export const { toggleFeatures, showStarredMessages, setTogglesToDefault } = toggleSlice.actions;
export default toggleSlice.reducer;