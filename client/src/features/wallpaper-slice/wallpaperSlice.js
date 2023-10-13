import { createSlice } from "@reduxjs/toolkit";

export const wallpaperSlice = createSlice({
    name: 'wallpaper',
    initialState: {
        value: "",
    },
    reducers: {
        selectWallpaper: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { selectWallpaper } = wallpaperSlice.actions;
export default wallpaperSlice.reducer;