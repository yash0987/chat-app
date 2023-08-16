import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        value: [false]
    },
    reducers: {
        showDeleteModal: (state) => {
            state.value[0] = !state.value[0];
        }
    }
})

export const { showDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;