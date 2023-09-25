import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: 'violet',
    },
    reducers: {
        selectTheme: (state, action) => {
            state.value = action.payload;
        },
    }
})

export const { selectTheme } = themeSlice.actions;
export default themeSlice.reducer;