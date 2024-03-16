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
        },
        setUserGroups: (state, action) => {
            state.value.user.groups = state.value.user.groups.map((group) => {
                if (group.id === action.payload.id) {
                    return action.payload;
                }
                return group;
            })
        }
    }
})

export const { setAuth, setUser, setUserGroups } = authSlice.actions;
export default authSlice.reducer;