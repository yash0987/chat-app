import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat-slice/chatSlice';
import authReducer from '../features/auth-slice/authSlice';
import modalReducer from '../features/modal-slice/modalSlice';
import selectMessageReducer from '../features/select-message-slice/selectMessageSlice';

export default configureStore({
    reducer: {
        chat: chatReducer,
        auth: authReducer,
        modal: modalReducer,
        selectmessage: selectMessageReducer
    }
})