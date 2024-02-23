import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import LoginPage from './views/loginpage/LoginPage';
import DefaultPage from './components/DefaultPage';
import ChatSection from './views/chat-messages/ChatSection';
import ColorPalette from './views/sidebar/components/ColorPalette';
import Wallpapers from './views/sidebar/components/Wallpapers';
import HomeLayout from './layouts/HomeLayout';
import ChatLayout from './layouts/ChatLayout';
import GroupLayout from './layouts/GroupLayout';
import RequestLayout from './layouts/RequestLayout';
import ThemeLayout from './layouts/ThemeLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route element={<Provider store={store}><HomeLayout /></Provider>}> {/* change position of layout */}
          <Route path='/chats/@me' element={<ChatLayout />}>
            <Route path='/chats/@me' element={<DefaultPage />} />
            <Route path='/chats/@me/:id' element={<ChatSection />} />
          </Route>
          <Route path='/groups' element={<GroupLayout />}>
            <Route path='/groups' element={<DefaultPage />} />
            <Route path='/groups/:groupid' element={<ChatSection />} />
          </Route>
          <Route path='/requests' element={<RequestLayout />} />
          <Route path='/themes' element={<ThemeLayout />}>
            <Route path='/themes' element={<ColorPalette />} />
            <Route path='/themes/wallpaper' element={<Wallpapers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;