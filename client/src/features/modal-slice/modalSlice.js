import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        value: [false]
    },
    reducers: {
        showDeleteModal: (state, action) => {
            state.value[0] = action.payload;
        }
    }
})

export const { showDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;