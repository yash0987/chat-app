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
        updateUserGroups: (state, action) => {
            state.value.user.groups = state.value.user.groups.map((group) => {
                if (group._id === action.payload._id) {
                    return action.payload;
                }
                return group;
            })
        },
        setUserFriends: (state, action) => {
            state.value.user.friends = [...state.value.user.friends, action.payload];
        },
        setUserGroups: (state, action) => {
            state.value.user.groups = [...state.value.user.groups, action.payload];
        },
        setUserSendRequest: (state, action) => {
            state.value.user.sendRequests = [...state.value.user.sendRequests, action.payload];
        },
        removeReceiveRequest: (state, action) => {
            state.value.user.receiveRequests = state.value.user.receiveRequests.filter((request) => request.personalId !== action.payload.personalId);
        },
        removeSendRequest: (state, action) => {
            state.value.user.sendRequests = state.value.user.sendRequests.filter((request) => request.personalId !== action.payload.personalId);
        }
    }
})

export const { setAuth, setUser, updateUserGroups, setUserGroups, setUserFriends, setUserSendRequest, removeReceiveRequest, removeSendRequest } = authSlice.actions;
export default authSlice.reducer;