import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        value: { authenticated: false, user: null, error: null }
    },
    reducers: {
        setAuth: (state, action) => {
            state.value = action.payload;
        },
        setUser: (state, action) => {
            state.value.user = action.payload;
        }
    }
})

export const { setAuth, setUser } = authSlice.actions;
export default authSlice.reducer;