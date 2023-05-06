import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat-slice/chatSlice';
import authReducer from '../features/auth-slice/authSlice';

export default configureStore({
    reducer: {
        chat: chatReducer,
        auth: authReducer,
    }
})