import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat-slice/chatSlice';

export default configureStore({
    reducer: {
        chat: chatReducer,
    },
})