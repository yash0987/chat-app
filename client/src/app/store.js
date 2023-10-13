import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat-slice/chatSlice';
import authReducer from '../features/auth-slice/authSlice';
import modalReducer from '../features/modal-slice/modalSlice';
import selectMessageReducer from '../features/select-message-slice/selectMessageSlice';
import toggleReducer from '../features/toggle-slice/toggleSlice';
import replyReducer from '../features/reply-slice/replySlice';
import themeReducer from '../features/theme-slice/themeSlice';
import wallpaperReducer from '../features/wallpaper-slice/wallpaperSlice';

export default configureStore({
    reducer: {
        chat: chatReducer,
        auth: authReducer,
        modal: modalReducer,
        selectmessage: selectMessageReducer,
        toggle: toggleReducer,
        reply: replyReducer,
        theme: themeReducer,
        wallpaper: wallpaperReducer,
    }
})