import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import LoginPage from './views/loginpage/LoginPage';
import DefaultPage from './components/DefaultPage';
import ChatSection from './views/chat-messages/ChatSection';
import HomeLayout from './layouts/HomeLayout';
import ChatLayout from './layouts/ChatLayout';
import GroupLayout from './layouts/GroupLayout';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<LoginPage />} />
        <Route element={<Provider store={store}><HomeLayout /></Provider>}> {/* change position of layout */}
          <Route path='/chats/@me' element={<ChatLayout />}>
            <Route path='/chats/@me' element={<DefaultPage />} />
            <Route path='/chats/@me/:id' element={<ChatSection />} />
          </Route>
          <Route path='/groups' element={<GroupLayout />}>
            <Route path='/groups' element={<DefaultPage />} />
            <Route path='/groups/:id' element={<ChatSection />} />
          </Route>
        </Route>
      </>
    )
  )

  return (
    <RouterProvider router={router} />
  );
}

export default App;