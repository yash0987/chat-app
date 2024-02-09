import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import LoginPage from './components/LoginPage';
import DefaultPage from './components/DefaultPage';
import ChatSection from './components/chat-section/ChatSection';
import CreateGroup from './components/CreateGroup';
import ColorPalette from './components/sidebar/ColorPalette';
import Wallpapers from './components/sidebar/Wallpapers';
import HomeLayout from './components/layout/HomeLayout';
import ChatLayout from './components/layout/ChatLayout';
import GroupLayout from './components/layout/GroupLayout';
import RequestLayout from './components/layout/RequestLayout';
import ThemeLayout from './components/layout/ThemeLayout';

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
            <Route path='/groups/create' element={<CreateGroup />} />
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