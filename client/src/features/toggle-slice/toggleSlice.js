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
        featuresToggle: (state, action) => {
            state.value.toggleFeatures = action.payload;
        },
        starMessagesToggle: (state, action) => {
            state.value.showStarredMessages = action.payload;
        },
        setTogglesToDefault: (state) => {
            state.value = { toggleFeatures: false, showStarredMessages: false };
        }
    }
})

export const { featuresToggle, starMessagesToggle, setTogglesToDefault } = toggleSlice.actions;
export default toggleSlice.reducer;