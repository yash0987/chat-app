import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: { authenticated: false, user: null, error: null },

    reducers: {
        setAuth: (state, action) => {
            state = action.payload;
        }
    }
})

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;