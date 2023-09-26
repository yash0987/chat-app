import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: {
            bg50: 'bg-violet-50',
            bg100: 'bg-violet-100',
            bg200: 'bg-violet-200',
            bg300: 'bg-violet-300',
            bg400: 'bg-violet-400',
            bg500: 'bg-violet-500',
            hoverBg50: 'hover:bg-violet-50',
            hoverBg100: 'hover:bg-violet-100',
            hoverBg200: 'hover:bg-violet-200',
            hoverBg300: 'hover:bg-violet-300',
            hoverBg400: 'hover:bg-violet-400',
            hoverBg500: 'hover:bg-violet-500',
            border50: 'border-violet-50',
            border100: 'border-violet-100',
            border200: 'border-violet-200',
            border300: 'border-violet-300',
            border400: 'border-violet-400',
            border500: 'border-violet-500',
            border600: 'border-violet-600',
            border700: 'border-violet-700',
            borderB700: 'border-b-violet-700',
            borderL700: 'border-l-violet-700',
            text50: 'text-violet-50',
            text100: 'text-violet-100',
            text200: 'text-violet-200',
            text300: 'text-violet-300',
            text400: 'text-violet-400',
            text500: 'text-violet-500',
            text600: 'text-violet-600',
            placeholderText400: 'placeholder:text-violet-400',
        }
    },
    reducers: {
        selectTheme: (state, action) => {
            state.value = action.payload;
        },
    }
})

export const { selectTheme } = themeSlice.actions;
export default themeSlice.reducer;